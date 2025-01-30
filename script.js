let items = JSON.parse(localStorage.getItem('invoiceItems')) || [];
let invoiceNumber = localStorage.getItem('invoiceNumber') || generateInvoiceNumber();
let previousInvoices = JSON.parse(localStorage.getItem('previousInvoices')) || [];

// دالة لإنشاء رقم فاتورة عشوائي
function generateInvoiceNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}

// تحميل البيانات عند تحميل الصفحة
window.onload = function () {
    if (items.length > 0) {
        document.getElementById('customerName').value = localStorage.getItem('customerName') || '';
        document.getElementById('customerPhone').value = localStorage.getItem('customerPhone') || '';
        updateInvoice();
    }
    loadPreviousInvoices();
};

// إضافة عنصر جديد
function addItem() {
    const productName = document.getElementById('productName').value;
    const quantity = parseFloat(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);

    if (productName && quantity && price) {
        items.push({ productName, quantity, price });
        localStorage.setItem('invoiceItems', JSON.stringify(items));
        localStorage.setItem('customerName', document.getElementById('customerName').value);
        localStorage.setItem('customerPhone', document.getElementById('customerPhone').value);
        updateInvoice();
        document.getElementById('productName').value = '';
        document.getElementById('quantity').value = '';
        document.getElementById('price').value = '';
    } else {
        alert("يرجى ملء جميع الحقول!");
    }
}

// تحديث الفاتورة
function updateInvoice() {
    const invoiceItems = document.getElementById('invoiceItems').getElementsByTagName('tbody')[0];
    invoiceItems.innerHTML = '';

    let subtotal = 0;
    items.forEach((item, index) => {
        const total = item.quantity * item.price;
        subtotal += total;

        const row = invoiceItems.insertRow();
        row.insertCell().textContent = item.productName;
        row.insertCell().textContent = item.quantity;
        row.insertCell().textContent = item.price.toFixed(2);
        row.insertCell().textContent = total.toFixed(2);

        // إضافة زر حذف
        const deleteCell = row.insertCell();
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'حذف';
        deleteButton.onclick = () => deleteItem(index);
        deleteCell.appendChild(deleteButton);

        // إضافة زر تعديل
        const editCell = row.insertCell();
        const editButton = document.createElement('button');
        editButton.textContent = 'تعديل';
        editButton.onclick = () => editItem(index);
        editCell.appendChild(editButton);
    });

    const tax = subtotal * 0.15;
    const grandTotal = subtotal + tax;

    document.getElementById('invoiceCustomerName').textContent = document.getElementById('customerName').value;
    document.getElementById('invoiceCustomerPhone').textContent = document.getElementById('customerPhone').value;
    document.getElementById('invoiceNumber').textContent = invoiceNumber;
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('tax').textContent = tax.toFixed(2);
    document.getElementById('grandTotal').textContent = grandTotal.toFixed(2);

    document.getElementById('invoiceSection').style.display = 'block';
}

// حذف عنصر
function deleteItem(index) {
    items.splice(index, 1);
    localStorage.setItem('invoiceItems', JSON.stringify(items));
    updateInvoice();
}

// تعديل عنصر
function editItem(index) {
    const item = items[index];
    document.getElementById('productName').value = item.productName;
    document.getElementById('quantity').value = item.quantity;
    document.getElementById('price').value = item.price;
    deleteItem(index); // حذف العنصر القديم بعد التعديل
}

// إنشاء فاتورة جديدة
function newInvoice() {
    const invoice = {
        customerName: document.getElementById('customerName').value,
        customerPhone: document.getElementById('customerPhone').value,
        invoiceNumber,
        items: [...items],
        subtotal: parseFloat(document.getElementById('subtotal').textContent),
        tax: parseFloat(document.getElementById('tax').textContent),
        grandTotal: parseFloat(document.getElementById('grandTotal').textContent),
    };
    previousInvoices.push(invoice);
    localStorage.setItem('previousInvoices', JSON.stringify(previousInvoices));

    items = [];
    invoiceNumber = generateInvoiceNumber();
    localStorage.removeItem('invoiceItems');
    localStorage.removeItem('customerName');
    localStorage.removeItem('customerPhone');
    localStorage.setItem('invoiceNumber', invoiceNumber);
    document.getElementById('invoiceForm').reset();
    document.getElementById('invoiceSection').style.display = 'none';
    loadPreviousInvoices();
}

// تحميل الفواتير السابقة
function loadPreviousInvoices() {
    const previousInvoicesList = document.getElementById('previousInvoicesList');
    previousInvoicesList.innerHTML = '';
    previousInvoices.forEach((invoice, index) => {
        const li = document.createElement('li');
        li.textContent = `فاتورة #${invoice.invoiceNumber} - ${invoice.customerName} - الإجمالي: ${invoice.grandTotal.toFixed(2)}`;
        previousInvoicesList.appendChild(li);
    });
    if (previousInvoices.length > 0) {
        document.getElementById('previousInvoices').style.display = 'block';
    }
}

// حفظ كـ PDF
function saveAsPDF() {
    const invoiceSection = document.getElementById('invoiceSection').innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = invoiceSection;
    window.print();

    document.body.innerHTML = originalContents;
    location.reload();
}

// Dark Mode Logic
const toggleDarkModeButton = document.getElementById('toggle-dark-mode');
const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    toggleDarkModeButton.innerHTML = '<i class="fas fa-sun"></i>';
}

toggleDarkModeButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    if (isDarkMode) {
        toggleDarkModeButton.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        toggleDarkModeButton.innerHTML = '<i class="fas fa-moon"></i>';
    }
});
