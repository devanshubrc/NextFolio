/**
 * pdfParser.ts — SSR-safe client-side PDF text extraction using PDF.js
 */

export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export interface ExtractedPDF {
  numPages: number;
  text: string;
  pages: ExtractedPage[];
}

export async function extractTextFromPDF(file: File): Promise<ExtractedPDF> {
  if (typeof window === 'undefined') {
    throw new Error('PDF parsing can only be performed in the browser environment.');
  }

  // Dynamically import pdfjs-dist to avoid SSR compilation issues
  const pdfjs = await import('pdfjs-dist');
  
  // Set the worker source pointing to the CDN matching the package version (5.6.205)
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version || '5.6.205'}/build/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const pages: ExtractedPage[] = [];
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    // Process text items, maintaining coordinate space relative sorting if possible
    // items is an array of TextItem objects. In pdfjs-dist, it has 'str' and 'transform' property
    const items = textContent.items as Array<{ str: string; transform: number[] }>;
    
    // Sort items by top coordinate descending (y is index 5 in transform matrix)
    // and left coordinate ascending (x is index 4 in transform matrix)
    const sortedItems = [...items].sort((a, b) => {
      const yA = a.transform[5];
      const yB = b.transform[5];
      const xA = a.transform[4];
      const xB = b.transform[4];
      
      // If same line (within 3px tolerance)
      if (Math.abs(yA - yB) < 3) {
        return xA - xB;
      }
      return yB - yA; // top-down
    });

    const pageText = sortedItems.map(item => item.str).join(' ');
    pages.push({
      pageNumber: i,
      text: pageText,
    });
    fullText += pageText + '\n';
  }

  return {
    numPages: pdf.numPages,
    text: fullText,
    pages,
  };
}
