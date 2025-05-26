import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDF = (transactions, username = 'User') => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Transaction Statement', 14, 22);

  doc.setFontSize(12);
  doc.text(`User: ${username}`, 14, 30);

  const rows = transactions.map((t) => [
    t.type.toUpperCase(),
    t.category,
    t.description,
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(t.amount),
    new Date(t.date).toLocaleDateString('en-IN'),
  ]);

  autoTable(doc, {
    startY: 40,
    head: [['Type', 'Category', 'Description', 'Amount', 'Date']],
    body: rows,
  });

  doc.save('Transaction_Statement.pdf');
};

