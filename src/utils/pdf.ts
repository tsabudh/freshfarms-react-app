import  { CellInput } from "jspdf-autotable";
import  type { Transaction } from "types/transaction.type";

// const x = {
//   _id: "6658ac49df06c26698386808",
//   type: "purchase",
//   customer: {
//     customerId: "64678cdbaacc08d817283330",
//     name: "sabudh",
//     _id: "6658ac49df06c26698386809",
//   },
//   items: [
//     {
//       productId: "65c9d5108998cf37d0ab05ef",
//       quantity: 1,
//       _id: "6658ac49df06c2669838680a",
//       productName: "cow milk",
//       priceThen: 120,
//     },
//     {
//       productId: "65c9d5418998cf37d0ab05f3",
//       quantity: 2,
//       _id: "6658ac49df06c2669838680b",
//       productName: "mixed milk",
//       priceThen: 130,
//     },
//   ],
//   paidInFull: false,
//   contract: false,
//   paid: 300,
//   createdBy: "660041424f4946e14c555191",
//   createdAt: "2024-05-30T16:41:45.836Z",
//   updatedAt: "2024-05-30T16:41:45.836Z",
//   issuedTime: "2024-05-30T16:41:45.836Z",
//   __v: 0,
//   totalQuantity: 3,
//   purchaseAmount: 380,
//   itemsVariety: 2,
// };

export async function convertToPDF(data: Transaction[]) {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const columns = [
    { header: "Time", dataKey: "time" },
    { header: "Date", dataKey: "date" },
    { header: "ID", dataKey: "_id" },
    { header: "Type", dataKey: "type" },
    { header: "Customer", dataKey: "customer" },
    { header: "Items", dataKey: "items" },
    { header: "Contract", dataKey: "contract" },
    { header: "Full Payment", dataKey: "paidInFull" },
    { header: "Purchase Amount", dataKey: "purchaseAmount" },
    { header: "Paid Amount", dataKey: "paid" },
  ];
  type ColumnKey = (typeof columns)[number]["dataKey"];

  const colNames = columns.map((item) => item.dataKey);
  const headerNames = columns.map((item) => item.header);
  const doc = new jsPDF({
    orientation: "landscape",
    format: "a4",
  });

  // Build the table headers
  doc.setFont("times", "normal");
  doc.setFontSize(12);

  doc.text(
    `Date: ${extractDate(new Date())}-${extractTime(new Date())}`,
    14,
    10,
    { align: "left" }
  );

  const rows = [];
  type TransactionKey = keyof Transaction;

  for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
    const singleRowData = [];

    for (let colIndex = 0; colIndex < colNames.length; colIndex++) {
      const currentColumn = colNames[colIndex] as ColumnKey;
      const currentTransaction = data[rowIndex];

      if (currentColumn == "time") {
        singleRowData.push(extractTime(currentTransaction["createdAt"] || "Unknown"));
        continue;
      }
      if (currentColumn == "date") {
        singleRowData.push(extractDate(currentTransaction["createdAt"] || "Unknown"));
        continue;
      }
      if (currentColumn == "_id") {
        doc.setFontSize(2);
        singleRowData.push(currentTransaction[currentColumn]);
        doc.setFontSize(12);
        continue;
      }

      if (currentColumn == "customer" && currentTransaction) {
        singleRowData.push(
          capitalizeName(currentTransaction[currentColumn].name || "")
        );
        continue;
      }
      if (currentColumn == "paidInFull" || currentColumn == "contract") {
        singleRowData.push(currentTransaction[currentColumn] ? "Yes" : "No");
        continue;
      }

      if (currentColumn == "items") {
        const cellData = currentTransaction[currentColumn].reduce(
          (accumulatorValue, currentItem) => {
            return (
              accumulatorValue + `${currentItem.code}:${currentItem.quantity} `
            );
          },
          ""
        );

        singleRowData.push(cellData);
        continue;
      }

      singleRowData.push(currentTransaction[currentColumn as TransactionKey]);
    }
    rows.push(singleRowData);
  }

  autoTable(doc, {
    head: [headerNames],
    headStyles: {
      fillColor: "#4d4d4d",
      textColor: "#ffffff",
      lineColor: "#aca89e",
    },
    columns: columns,
    body: rows as CellInput[][],
    columnStyles: {
      time: {
        cellWidth: 20,
      },
      date: { cellWidth: 30 },
      _id: { cellWidth: 25, fontSize: 8 }, // Set font size for the '_id' column
      type: { cellWidth: 20 },
      customer: { cellWidth: 35 },
      items: { cellWidth: 40 },
      paidInFull: { cellWidth: 20 },
      contract: { cellWidth: 20 },
      paid: { cellWidth: 20 },
      purchaseAmount: { cellWidth: 20 },
    },
    didParseCell: function () {
      // Check if the column is '_id'
    },
    alternateRowStyles: {
      fillColor: "#efefef",
      // fillColor: '#d9ffe9',
    },
    styles: {
      // Apply styles to all rows
      cellPadding: 2,
      lineWidth: 0.1,
      lineColor: "#aca89e", // Color for borders
    },
  });

  // Save the PDF
  doc.save(
    `Transactions-${extractDate(new Date())}-${extractTime(new Date())}`
  );
}

function extractDate(timeStamp: string | Date) {
  const transactionDate = new Date(timeStamp).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return transactionDate;
}

function extractTime(timeStamp: string | Date) {
  const transactionTime = new Date(timeStamp).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "numeric",
  });
  return transactionTime;
}

function capitalizeName(name:string) {
  return name.replace(/\b\w/g, (char) => char.toUpperCase());
}
