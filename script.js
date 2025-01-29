document.addEventListener("DOMContentLoaded", function () {
  // التعامل مع إضافة منتج
  document.getElementById("add-purchase").addEventListener("click", function () {
    const product = document.getElementById("purchase-product").value;
    const quantity = parseFloat(document.getElementById("purchase-quantity").value);
    const price = parseFloat(document.getElementById("purchase-price").value);

    // التحقق من المدخلات
    if (!product || !quantity || !price) {
      alert("يرجى إدخال جميع البيانات بشكل صحيح");
      return;
    }

    const total = quantity * price;

    // إنشاء صف جديد للمنتج
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product}</td>
      <td>${quantity}</td>
      <td>${price}</td>
      <td>${total}</td>
    `;

    // إضافة الصف إلى الجدول
    document.querySelector("#purchases-table tbody").appendChild(row);

    // تحديث المجموع الكلي والضريبة
    calculateTotals();
  });

  // دالة لحساب المجموع الكلي والضريبة
  function calculateTotals() {
    const rows = document.querySelectorAll("#purchases-table tbody tr");
    let total = 0;
    rows.forEach(row => {
      total += parseFloat(row.cells[3].textContent);
    });

    const tax = total * 0.15; // حساب الضريبة (15%)
    const grandTotal = total + tax; // المجموع الكلي (المجموع + الضريبة)

    // تحديث العرض في الصفحة
    document.getElementById("tax-total").textContent = tax.toFixed(2);
    document.getElementById("grand-total").textContent = grandTotal.toFixed(2);
  }

  // التعامل مع تحميل الفاتورة كـ PDF
  document.getElementById("download-invoice").addEventListener("click", function () {
    const clientName = document.getElementById("client-name").value;
    const clientPhone = document.getElementById("client-phone").value;

    // تحقق من المدخلات قبل تنزيل الفاتورة
    if (!clientName || !clientPhone) {
      alert("يرجى إدخال جميع بيانات العميل");
      return;
    }

    // إنشاء ملف PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // إضافة عنوان الفاتورة
    doc.setFontSize(18);
    doc.text("فاتورة شراء", 105, 15, { align: 'center' });

    // إضافة معلومات العميل
    doc.setFontSize(12);
    doc.text(`اسم العميل: ${clientName}`, 20, 30);
    doc.text(`رقم الجوال: ${clientPhone}`, 20, 40);
    doc.text(`تاريخ الفاتورة: ${new Date().toLocaleDateString('ar-EG')}`, 20, 50);

    // إضافة جدول المشتريات
    const headers = ["المنتج", "الكمية", "السعر", "المجموع"];
    const rows = Array.from(document.querySelectorAll("#purchases-table tbody tr")).map(row => {
      return Array.from(row.cells).map(cell => cell.textContent);
    });

    doc.autoTable({
      startY: 60,
      head: [headers],
      body: rows,
      theme: 'grid',
      styles: { font: 'Arial', fontSize: 10, halign: 'center' },
      headStyles: { fillColor: [52, 152, 219] }
    });

    // إضافة الضريبة والمجموع الكلي
    const taxTotal = document.getElementById("tax-total").textContent;
    const grandTotal = document.getElementById("grand-total").textContent;
    doc.text(`جمع الضريبة (15%): ${taxTotal}`, 20, doc.autoTable.previous.finalY + 10);
    doc.text(`المجموع الكلي: ${grandTotal}`, 20, doc.autoTable.previous.finalY + 20);

    // حفظ الملف
    doc.save("Invoice.pdf");
  });

  // التعامل مع إضافة فاتورة جديدة
  document.getElementById("new-invoice").addEventListener("click", function () {
    // إعادة تعيين المدخلات والجدول عند إضافة فاتورة جديدة
    document.getElementById("invoice-form").reset();
    document.getElementById("purchases-table").querySelector("tbody").innerHTML = '';
    document.getElementById("tax-total").textContent = '0.00';
    document.getElementById("grand-total").textContent = '0.00';
  });
});
