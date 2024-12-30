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

  // التعامل مع تحميل الفاتورة
  document.getElementById("download-invoice").addEventListener("click", function () {
    const clientName = document.getElementById("client-name").value;
    const clientPhone = document.getElementById("client-phone").value;

    // تحقق من المدخلات قبل تنزيل الفاتورة
    if (!clientName || !clientPhone) {
      alert("يرجى إدخال جميع بيانات العميل");
      return;
    }

    // إنشاء بيانات الفاتورة
    const workbook = XLSX.utils.book_new();
    const ws_data = [
      ["اسم العميل", "رقم الجوال", "تاريخ اليوم"],
      [clientName, clientPhone, new Date().toLocaleDateString('ar-EG')],
      [],
      ["المنتج", "الكمية", "السعر", "المجموع"],
      ...Array.from(document.querySelectorAll("#purchases-table tbody tr")).map(row => {
        return Array.from(row.cells).map(cell => cell.textContent);
      }),
      [],
      ["جمع الضريبة (15%)", document.getElementById("tax-total").textContent],
      ["المجموع الكلي", document.getElementById("grand-total").textContent]
    ];

    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // تحسين التنسيق في Excel
    const headerStyle = { font: { bold: true }, fill: { fgColor: { rgb: "FFFF00" } }, border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } } } };
    for (let i = 0; i < 4; i++) {
      ws['A1'].s = headerStyle;
      ws['B1'].s = headerStyle;
      ws['C1'].s = headerStyle;
      ws['D1'].s = headerStyle;
    }

    // إضافة ورقة العمل إلى الكتاب
    XLSX.utils.book_append_sheet(workbook, ws, "الفاتورة");

    // تنزيل الفاتورة
    XLSX.writeFile(workbook, "Invoice.xlsx");
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
