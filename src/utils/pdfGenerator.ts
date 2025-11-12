import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as pdfjsLib from "pdfjs-dist";
import type { InventoryRow, PettyCashRow, AutoExpensesRow } from "@/types";

// Configure PDF.js worker - use CDN or local worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

const A4_WIDTH = 210; // mm
const A4_HEIGHT = 297; // mm
const MARGIN = 20; // mm

export const generateInventoryPDF = (
  rows: InventoryRow[],
  title: string,
  subtitle: string,
  preview: boolean = false
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Header
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(title, A4_WIDTH / 2, MARGIN, { align: "center" });

  if (subtitle) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(subtitle, A4_WIDTH / 2, MARGIN + 7, { align: "center" });
  }

  // Table
  const tableData = rows.map((row) => [
    row.lote,
    row.producto,
    row.cantidad.toLocaleString("es-AR"),
    row.unidad,
    row.observaciones, // Mantenemos el campo como "observaciones" en el código pero se mostrará como "Faltante"
  ]);

  const totalCantidad = rows.reduce((sum, row) => sum + (row.cantidad || 0), 0);

  autoTable(doc, {
    startY: subtitle ? MARGIN + 15 : MARGIN + 10,
    head: [["Lote", "Producto", "Cantidad", "Unidad", "Faltante"]],
    body: tableData,
    foot: [["", "Total:", totalCantidad.toLocaleString("es-AR"), "", ""]],
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 3,
      lineColor: [229, 231, 235],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [0, 74, 173], // Primary color
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "left",
    },
    footStyles: {
      fillColor: [240, 240, 245],
      textColor: [17, 24, 39],
      fontStyle: "bold",
    },
    columnStyles: {
      2: { halign: "right" }, // Cantidad
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    margin: { left: MARGIN, right: MARGIN },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Página ${i} de ${pageCount}`,
      A4_WIDTH / 2,
      A4_HEIGHT - MARGIN / 2,
      { align: "center" }
    );
  }

  if (preview) {
    window.open(doc.output("bloburl"), "_blank");
  } else {
    doc.save(`inventario-${new Date().getTime()}.pdf`);
  }
};

export const generatePettyCashPDF = (
  rows: PettyCashRow[],
  title: string,
  subtitle: string,
  preview: boolean = false
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Header
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(title, A4_WIDTH / 2, MARGIN, { align: "center" });

  if (subtitle) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(subtitle, A4_WIDTH / 2, MARGIN + 7, { align: "center" });
  }

  // Table
  const tableData = rows.map((row) => [
    row.fecha,
    row.concepto,
    row.categoria,
    `$ ${row.ingreso.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    `$ ${row.egreso.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    `$ ${row.saldo.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    row.nota,
  ]);

  const totalIngreso = rows.reduce((sum, row) => sum + (row.ingreso || 0), 0);
  const totalEgreso = rows.reduce((sum, row) => sum + (row.egreso || 0), 0);
  const saldoFinal = rows.length > 0 ? rows[rows.length - 1].saldo : 0;

  autoTable(doc, {
    startY: subtitle ? MARGIN + 15 : MARGIN + 10,
    head: [["Fecha", "Concepto", "Categoría", "Ingreso", "Egreso", "Saldo", "Nota"]],
    body: tableData,
    foot: [[
      "",
      "",
      "Totales:",
      `$ ${totalIngreso.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      `$ ${totalEgreso.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      `$ ${saldoFinal.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      "",
    ]],
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      lineColor: [229, 231, 235],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [255, 82, 103], // Secondary color
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "left",
    },
    footStyles: {
      fillColor: [240, 240, 245],
      textColor: [17, 24, 39],
      fontStyle: "bold",
    },
    columnStyles: {
      3: { halign: "right" }, // Ingreso
      4: { halign: "right" }, // Egreso
      5: { halign: "right" }, // Saldo
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    margin: { left: MARGIN, right: MARGIN },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Página ${i} de ${pageCount}`,
      A4_WIDTH / 2,
      A4_HEIGHT - MARGIN / 2,
      { align: "center" }
    );
  }

  if (preview) {
    window.open(doc.output("bloburl"), "_blank");
  } else {
    doc.save(`caja-chica-${new Date().getTime()}.pdf`);
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const pdfToImage = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    // Get first page
    const page = await pdf.getPage(1);
    
    // Set scale for good quality (2x for better resolution)
    const scale = 2.0;
    const viewport = page.getViewport({ scale });
    
    // Create canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    // Render PDF page to canvas
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
    
    // Convert canvas to base64 image
    return canvas.toDataURL('image/jpeg', 0.9);
  } catch (error) {
    console.error('Error converting PDF to image:', error);
    throw error;
  }
};

export const generateAutoExpensesPDF = async (
  rows: AutoExpensesRow[],
  title: string,
  subtitle: string,
  preview: boolean = false
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Header
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(title, A4_WIDTH / 2, MARGIN, { align: "center" });

  if (subtitle) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(subtitle, A4_WIDTH / 2, MARGIN + 7, { align: "center" });
  }

  // Table
  const tableData = rows.map((row) => {
    const fecha = new Date(row.fecha + 'T00:00:00').toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const tipoCapitalized = row.tipo.charAt(0).toUpperCase() + row.tipo.slice(1);
    return [
      fecha,
      tipoCapitalized,
      `$ ${row.monto.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    ];
  });

  const totalMonto = rows.reduce((sum, row) => sum + (row.monto || 0), 0);

  autoTable(doc, {
    startY: MARGIN + 10,
    head: [["Fecha", "Tipo", "Monto"]],
    body: tableData,
    foot: [[
      "",
      "Total:",
      `$ ${totalMonto.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    ]],
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 2.5,
      lineColor: [229, 231, 235],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [139, 92, 246], // Accent color (purple)
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "left",
    },
    footStyles: {
      fillColor: [240, 240, 245],
      textColor: [17, 24, 39],
      fontStyle: "bold",
    },
    columnStyles: {
      2: { halign: "right" }, // Monto
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    margin: { left: MARGIN, right: MARGIN },
  });

  // Add receipt images if any row has receipts
  const rowsWithReceipts = rows.filter(row => row.recibos && row.recibos.length > 0);
  
  if (rowsWithReceipts.length > 0) {
    let currentY = doc.lastAutoTable.finalY || MARGIN + 50;
    let hasImagesAdded = false;
    
    for (const row of rowsWithReceipts) {
      if (!row.recibos || row.recibos.length === 0) continue;
      
      // Check if we need a new page
      if (currentY > A4_HEIGHT - 80) {
        doc.addPage();
        currentY = MARGIN;
      }
      
      // Add images and PDFs in a grid layout (3 columns for better readability)
      const imageSpacing = 4; // mm between images
      const imagesPerRow = 3;
      const maxImageWidth = (A4_WIDTH - (MARGIN * 2) - (imageSpacing * (imagesPerRow - 1))) / imagesPerRow;
      const maxImageHeight = 60; // max height per image in a row (increased for better readability)
      
      const allFiles = row.recibos; // Process all files (images and PDFs)
      let imagePositionY = currentY;
      let colPos = 0; // Current column (0, 1, or 2)
      
      for (let i = 0; i < allFiles.length; i++) {
        const file = allFiles[i];
        
        try {
          // Calculate which row this file belongs to
          const rowIndex = Math.floor(i / imagesPerRow);
          const currentRowY = imagePositionY + (rowIndex * (maxImageHeight + imageSpacing));
          
          // Check if we need a new page
          if (currentRowY > A4_HEIGHT - 80) {
            doc.addPage();
            // Reset to start of new page
            const newRowIndex = Math.floor((i - Math.floor(i / imagesPerRow) * imagesPerRow) / imagesPerRow);
            imagePositionY = MARGIN;
            colPos = 0;
          }
          
          // Calculate position for this file
          const currentRowYPos = imagePositionY + (rowIndex * (maxImageHeight + imageSpacing));
          const xPos = MARGIN + ((i % imagesPerRow) * (maxImageWidth + imageSpacing));
          const yPos = currentRowYPos;
          
          // Check if file is PDF (by MIME type or extension)
          const isPDF = file.type === 'application/pdf' || 
                       file.type === 'application/x-pdf' ||
                       file.name.toLowerCase().endsWith('.pdf');
          
          if (file.type.startsWith('image/')) {
            // Process image files
            const imageData = await fileToBase64(file);
            
            // Get image dimensions
            const img = new Image();
            img.src = imageData;
            
            // Wait for image to load
            await new Promise((resolve) => {
              img.onload = resolve;
            });
            
            // Calculate dimensions to fit while maintaining aspect ratio
            let imgWidth = img.width;
            let imgHeight = img.height;
            
            // Calculate scaling to fit within max dimensions
            const widthRatio = maxImageWidth / imgWidth;
            const heightRatio = maxImageHeight / imgHeight;
            const ratio = Math.min(widthRatio, heightRatio);
            
            imgWidth = imgWidth * ratio;
            imgHeight = imgHeight * ratio;
            
            // Add image to PDF
            doc.addImage(imageData, 'JPEG', xPos, yPos, imgWidth, imgHeight, undefined, 'FAST');
            hasImagesAdded = true;
          } else if (isPDF) {
            // Process PDF files - convert first page to image
            try {
              const imageData = await pdfToImage(file);
              
              // Get image dimensions
              const img = new Image();
              img.src = imageData;
              
              // Wait for image to load
              await new Promise((resolve) => {
                img.onload = resolve;
              });
              
              // Calculate dimensions to fit while maintaining aspect ratio
              let imgWidth = img.width;
              let imgHeight = img.height;
              
              // Calculate scaling to fit within max dimensions
              const widthRatio = maxImageWidth / imgWidth;
              const heightRatio = maxImageHeight / imgHeight;
              const ratio = Math.min(widthRatio, heightRatio);
              
              imgWidth = imgWidth * ratio;
              imgHeight = imgHeight * ratio;
              
              // Add PDF page as image to PDF
              doc.addImage(imageData, 'JPEG', xPos, yPos, imgWidth, imgHeight, undefined, 'FAST');
              hasImagesAdded = true;
            } catch (error) {
              console.error('Error rendering PDF as image:', error);
              // Fallback to placeholder if PDF rendering fails
              const pdfBoxWidth = maxImageWidth;
              const pdfBoxHeight = maxImageHeight;
              
              // Draw a border box for the PDF
              doc.setDrawColor(200, 0, 0); // Red border
              doc.setLineWidth(0.5);
              doc.rect(xPos, yPos, pdfBoxWidth, pdfBoxHeight);
              
              // Fill with light red background
              doc.setFillColor(255, 240, 240);
              doc.rect(xPos, yPos, pdfBoxWidth, pdfBoxHeight, 'F');
              
              // Add PDF icon/text
              doc.setFontSize(20);
              doc.setTextColor(200, 0, 0);
              doc.text('PDF', xPos + pdfBoxWidth / 2, yPos + 12, { align: 'center' });
              
              // Add file name (truncate if too long)
              doc.setFontSize(8);
              doc.setTextColor(0, 0, 0);
              const fileName = file.name.length > 30 ? file.name.substring(0, 27) + '...' : file.name;
              doc.text(fileName, xPos + pdfBoxWidth / 2, yPos + pdfBoxHeight - 5, { align: 'center', maxWidth: pdfBoxWidth - 4 });
              
              hasImagesAdded = true;
            }
          } else {
            // Unknown file type - show placeholder
            console.warn('Unknown file type:', file.type, file.name);
            const fileBoxWidth = maxImageWidth;
            const fileBoxHeight = maxImageHeight;
            
            // Draw a border box
            doc.setDrawColor(150, 150, 150);
            doc.setLineWidth(0.5);
            doc.rect(xPos, yPos, fileBoxWidth, fileBoxHeight);
            
            // Fill with light gray background
            doc.setFillColor(240, 240, 240);
            doc.rect(xPos, yPos, fileBoxWidth, fileBoxHeight, 'F');
            
            // Add file name
            doc.setFontSize(8);
            doc.setTextColor(0, 0, 0);
            const fileName = file.name.length > 30 ? file.name.substring(0, 27) + '...' : file.name;
            doc.text(fileName, xPos + fileBoxWidth / 2, yPos + fileBoxHeight / 2, { align: 'center', maxWidth: fileBoxWidth - 4 });
            
            hasImagesAdded = true;
          }
          
        } catch (error) {
          console.error('Error adding file:', error);
          // Continue with next file
        }
      }
      
      // Update currentY for next section
      const totalRows = Math.ceil(allFiles.length / imagesPerRow);
      currentY = imagePositionY + (totalRows * (maxImageHeight + imageSpacing));
    }
    
    // If no images were added but there were files, at least show a note
    if (!hasImagesAdded && rowsWithReceipts.length > 0) {
      if (currentY > A4_HEIGHT - 60) {
        doc.addPage();
        currentY = MARGIN;
      }
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Recibos adjuntos:", MARGIN, currentY + 5);
      rowsWithReceipts.forEach((row) => {
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        currentY += 5;
        doc.text(`• ${row.tipo.charAt(0).toUpperCase() + row.tipo.slice(1)}: ${row.recibos!.length} archivo(s)`, MARGIN + 3, currentY);
      });
    }
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Página ${i} de ${pageCount}`,
      A4_WIDTH / 2,
      A4_HEIGHT - MARGIN / 2,
      { align: "center" }
    );
  }

  if (preview) {
    window.open(doc.output("bloburl"), "_blank");
  } else {
    doc.save(`gastos-auto-${new Date().getTime()}.pdf`);
  }
};
