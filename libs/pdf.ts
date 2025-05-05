// src/libs/pdf.ts
"use client";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const generateTransactionPDF = (transactions: any[]) => {
  const docDefinition = {
    content: [
      { text: "Transaction History", style: "header" },
      {
        table: {
          headerRows: 1,
          widths: ["*", "*", "*", "*"],
          body: [
            ["Transaction Type", "Amount", "Date", "Transaction ID"],
            ...transactions.map((tx) => [
              tx.txType,
              `${tx.amount} บาท`,
              new Date(tx.txDate).toLocaleString(),
              tx.id,
            ]),
          ],
        },
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
    },
    defaultStyle: {
      font: "Helvetica",
    },
  };

  pdfMake.createPdf(docDefinition).download("transactions.pdf");
};
