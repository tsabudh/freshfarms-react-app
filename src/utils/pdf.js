import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function convertToPDF(data) {
    console.log(data);
    let colNames = [
        'issuedTime',
        '_id',
        'customerName',
        'customerId',
        'issuedBy',
        'type',
        'itemsVariety',
        'paid',
        'purchaseAmount',
    ];
    // Initialize jsPDF
    var doc = new jsPDF({
        orientation: 'landscape',
        format: 'a4',
    });

    // Build the table headers
    doc.setFont('times', 'normal');
    doc.setFontSize(12);

    let row1 = [];
    let row2 = [];
    for (let i = 0; i < colNames.length; i++) {
        let rowData, data2;

        rowData = data[i][`${colNames[i]}`];

        if (colNames[i] == 'issuedBy') {
            rowData = data[i][`issuedBy`].name;
        }

        if (colNames[i] == 'customerName') {
            rowData = data[i][`customer`].name;
        }
        if (colNames[i] == 'customerId') {
            rowData = data[i][`customer`].customerId;
        }

        row1.push(rowData);
    }

    autoTable(doc, {
        head: [colNames],
        body: [row1, row2],
    });

    // Save the PDF
    doc.save('data.pdf');
}

function convertDateToLocal() {
    let transactionTime = new Date(timeStamp).toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: 'numeric',
    });
    let transactionDate = new Date(timeStamp).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}
