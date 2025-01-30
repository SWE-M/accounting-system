let items = [];
let invoiceNumber = generateInvoiceNumber(); // إنشاء رقم فاتورة عشوائي

// دالة لإنشاء رقم فاتورة عشوائي مكون من 6 أرقام
function generateInvoiceNumber() {
    return Math.floor(100000 + Math.random() * 900000); // رقم بين 100000 و 999999
}

function addItem() {
    const productName = document.getElementById('productName').value;
    const quantity = parseFloat(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);

    if (productName && quantity && price) {
        items.push({ productName, quantity, price });
        updateInvoice();
        document.getElementById('productName').value = '';
        document.getElementById('quantity').value = '';
        document.getElementById('price').value = '';
    } else {
        alert("يرجى ملء جميع الحقول!");
    }
}

function updateInvoice() {
    const invoiceItems = document.getElementById('invoiceItems').getElementsByTagName('tbody')[0];
    invoiceItems.innerHTML = '';

    let subtotal = 0;
    items.forEach(item => {
        const total = item.quantity * item.price;
        subtotal += total;

        const row = invoiceItems.insertRow();
        row.insertCell().textContent = item.productName;
        row.insertCell().textContent = item.quantity;
        row.insertCell().textContent = item.price.toFixed(2);
        row.insertCell().textContent = total.toFixed(2);
    });

    const tax = subtotal * 0.15;
    const grandTotal = subtotal + tax;

    document.getElementById('invoiceCustomerName').textContent = document.getElementById('customerName').value;
    document.getElementById('invoiceCustomerPhone').textContent = document.getElementById('customerPhone').value;
    document.getElementById('invoiceNumber').textContent = invoiceNumber; // عرض رقم الفاتورة
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('tax').textContent = tax.toFixed(2);
    document.getElementById('grandTotal').textContent = grandTotal.toFixed(2);

    document.getElementById('invoiceSection').style.display = 'block';
}

function newInvoice() {
    items = [];
    invoiceNumber = generateInvoiceNumber(); // إنشاء رقم فاتورة جديد
    document.getElementById('invoiceForm').reset();
    document.getElementById('invoiceSection').style.display = 'none';
}

function printInvoice() {
    window.print();
}

function saveAsPDF() {
    const invoiceSection = document.getElementById('invoiceSection').innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = invoiceSection;
    window.print();

    document.body.innerHTML = originalContents;
    location.reload(); // لإعادة تحميل الصفحة بعد الطباعة
}

// Dark Mode Logic
const toggleDarkModeButton = document.getElementById('toggle-dark-mode');
const body = document.body;

// تحميل التفضيل من localStorage
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    toggleDarkModeButton.innerHTML = '<i class="fas fa-sun"></i>'; // أيقونة الشمس للوضع الداكن
}

// تبديل الوضع عند النقر على الزر
toggleDarkModeButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    // تغيير الأيقونة
    if (isDarkMode) {
        toggleDarkModeButton.innerHTML = '<i class="fas fa-sun"></i>'; // أيقونة الشمس للوضع الداكن
    } else {
        toggleDarkModeButton.innerHTML = '<i class="fas fa-moon"></i>'; // أيقونة القمر للوضع الفاتح
    }
});
