// Type declarations for html2canvas
declare module 'html2canvas' {
  interface Html2CanvasOptions {
    width?: number;
    height?: number;
    scale?: number;
    useCORS?: boolean;
    allowTaint?: boolean;
    backgroundColor?: string;
    logging?: boolean;
    removeContainer?: boolean;
    foreignObjectRendering?: boolean;
    onclone?: (clonedDoc: Document) => void;
    ignoreElements?: (element: Element) => boolean;
  }

  interface Html2Canvas {
    (element: HTMLElement, options?: Html2CanvasOptions): Promise<HTMLCanvasElement>;
  }

  const html2canvas: Html2Canvas;
  export default html2canvas;
}

// Type declarations for jspdf
declare module 'jspdf' {
  interface jsPDFOptions {
    orientation?: 'portrait' | 'landscape';
    unit?: 'pt' | 'mm' | 'cm' | 'in';
    format?: 'a4' | 'a3' | number | [number, number];
  }

  class jsPDF {
    constructor(options?: jsPDFOptions);
    addImage(imageData: string, format: string, x: number, y: number, width: number, height: number): void;
    addPage(): void;
    save(fileName: string): void;
    internal: {
      pageSize: {
        getWidth(): number;
        getHeight(): number;
      };
    };
  }

  export default jsPDF;
}
