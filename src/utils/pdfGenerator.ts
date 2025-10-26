import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { InventoryRow, PettyCashRow, AutoExpensesRow } from "@/types";

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

  // Date
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const currentDate = new Date().toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  doc.text(`Fecha de emisión: ${currentDate}`, A4_WIDTH - MARGIN, MARGIN, {
    align: "right",
  });

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
    doc.text(
      "DataPrint AR",
      MARGIN,
      A4_HEIGHT - MARGIN / 2,
      { align: "left" }
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

  // Date
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const currentDate = new Date().toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  doc.text(`Fecha de emisión: ${currentDate}`, A4_WIDTH - MARGIN, MARGIN, {
    align: "right",
  });

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
    doc.text(
      "DataPrint AR",
      MARGIN,
      A4_HEIGHT - MARGIN / 2,
      { align: "left" }
    );
  }

  if (preview) {
    window.open(doc.output("bloburl"), "_blank");
  } else {
    doc.save(`caja-chica-${new Date().getTime()}.pdf`);
  }
};

export const generateAutoExpensesPDF = (
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

  // Date
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const currentDate = new Date().toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  doc.text(`Fecha de emisión: ${currentDate}`, A4_WIDTH - MARGIN, MARGIN, {
    align: "right",
  });

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
      row.descripcion,
      `$ ${row.monto.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      row.kilometraje,
      row.nota,
    ];
  });

  const totalMonto = rows.reduce((sum, row) => sum + (row.monto || 0), 0);

  autoTable(doc, {
    startY: subtitle ? MARGIN + 15 : MARGIN + 10,
    head: [["Fecha", "Tipo", "Descripción", "Monto", "Km", "Nota"]],
    body: tableData,
    foot: [[
      "",
      "",
      "Total:",
      `$ ${totalMonto.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      "",
      "",
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
      3: { halign: "right" }, // Monto
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
    doc.text(
      "DataPrint AR",
      MARGIN,
      A4_HEIGHT - MARGIN / 2,
      { align: "left" }
    );
  }

  if (preview) {
    window.open(doc.output("bloburl"), "_blank");
  } else {
    doc.save(`gastos-auto-${new Date().getTime()}.pdf`);
  }
};
