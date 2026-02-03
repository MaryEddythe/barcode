const addDocBtn = document.getElementById('addDocBtn');
const documentModal = document.getElementById('documentModal');
const barcodeModal = document.getElementById('barcodeModal');
const closeModal = document.getElementById('closeModal');
const closeBarcodeModal = document.getElementById('closeBarcodeModal');
const cancelModal = document.getElementById('cancelModal');
const cancelBarcodeBtn = document.getElementById('cancelBarcodeBtn');
const documentForm = document.getElementById('documentForm');
const documentsList = document.getElementById('documentsList');
const modalTitle = document.getElementById('modalTitle');
const printBtn = document.getElementById('printBtn');
const confirmBtn = document.getElementById('confirmBtn');

let editingId = null;
let currentDocument = null;

// Load documents on page load
document.addEventListener('DOMContentLoaded', () => {
  loadDocuments();
});

// Open modal for new document
addDocBtn.addEventListener('click', () => {
  editingId = null;
  modalTitle.textContent = 'Add New Document';
  documentForm.reset();
  documentModal.style.display = 'flex';
});

// Close document modal
closeModal.addEventListener('click', () => {
  documentModal.style.display = 'none';
});

cancelModal.addEventListener('click', () => {
  documentModal.style.display = 'none';
});

// Close barcode modal
closeBarcodeModal.addEventListener('click', () => {
  barcodeModal.style.display = 'none';
});

cancelBarcodeBtn.addEventListener('click', () => {
  barcodeModal.style.display = 'none';
});

// Close modals when clicking outside
window.addEventListener('click', (event) => {
  if (event.target === documentModal) {
    documentModal.style.display = 'none';
  }
  if (event.target === barcodeModal) {
    barcodeModal.style.display = 'none';
  }
});

// Generate barcode
function generateBarcode(documentData) {
  const timestamp = new Date().toLocaleString();
  const barcodeValue = `${documentData.addressor}-${documentData.documentType}-${Date.now()}`;
  
  // Display document info
  document.getElementById('barcodeAddressor').textContent = documentData.addressor;
  document.getElementById('barcodeCompanyAddress').textContent = documentData.companyAddress;
  document.getElementById('barcodeSubject').textContent = documentData.subject;
  document.getElementById('barcodeAddressee').textContent = documentData.addressee;
  document.getElementById('barcodeDateReleased').textContent = documentData.dateReleased;
  document.getElementById('barcodeDocumentType').textContent = documentData.documentType;
  document.getElementById('barcodeRemarks').textContent = documentData.remarks;
  document.getElementById('stickerTime').textContent = timestamp;
  document.getElementById('stickerTimestamp').textContent = barcodeValue;
  
  // Generate barcode
  JsBarcode('#barcodeSticker', barcodeValue, {
    format: 'CODE128',
    width: 2,
    height: 50,
    displayValue: true
  });
  
  return barcodeValue;
}

// Save document
documentForm.addEventListener('submit', (e) => {
  e.preventDefault();

  currentDocument = {
    id: editingId || Date.now(),
    addressor: document.getElementById('addressor').value,
    companyAddress: document.getElementById('companyAddress').value,
    subject: document.getElementById('subject').value,
    addressee: document.getElementById('addressee').value,
    dateReleased: document.getElementById('dateReleased').value,
    documentType: document.getElementById('documentType').value,
    remarks: document.getElementById('remarks').value,
    barcode: ''
  };

  // Generate barcode and show modal
  const barcodeValue = generateBarcode(currentDocument);
  currentDocument.barcode = barcodeValue;
  
  // Hide document form modal and show barcode modal
  documentModal.style.display = 'none';
  barcodeModal.style.display = 'flex';
});

// Confirm and save document to database
confirmBtn.addEventListener('click', () => {
  let documents = getDocuments();

  if (editingId) {
    documents = documents.map(doc => doc.id === editingId ? currentDocument : doc);
  } else {
    documents.push(currentDocument);
  }

  localStorage.setItem('documents', JSON.stringify(documents));
  loadDocuments();
  barcodeModal.style.display = 'none';
  currentDocument = null;
});

// Print/Download barcode
printBtn.addEventListener('click', () => {
  const element = document.getElementById('printableBarcode');
  const opt = {
    margin: 10,
    filename: `barcode-${currentDocument.addressor}.pdf`,
    image: { type: 'png', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  };
  // Note: You'll need to include html2pdf library for this to work
  alert('Download feature requires html2pdf library. Please add the library to enable PDF download.');
});

// Load and display documents
function loadDocuments() {
  const documents = getDocuments();

  if (documents.length === 0) {
    documentsList.innerHTML = '<tr class="empty-row"><td colspan="8">No documents added yet</td></tr>';
    return;
  }

  documentsList.innerHTML = documents.map(doc => `
    <tr>
      <td>${doc.addressor}</td>
      <td>${doc.companyAddress}</td>
      <td>${doc.subject}</td>
      <td>${doc.addressee}</td>
      <td>${doc.dateReleased}</td>
      <td>${doc.documentType}</td>
      <td>${doc.remarks}</td>
      <td>
        <div class="action-buttons">
          <button class="btn-edit" onclick="editDocument(${doc.id})">Edit</button>
          <button class="btn-delete" onclick="deleteDocument(${doc.id})">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Get documents from localStorage
function getDocuments() {
  const docs = localStorage.getItem('documents');
  return docs ? JSON.parse(docs) : [];
}

// Edit document
function editDocument(id) {
  const documents = getDocuments();
  const doc = documents.find(d => d.id === id);

  if (doc) {
    editingId = id;
    document.getElementById('addressor').value = doc.addressor;
    document.getElementById('companyAddress').value = doc.companyAddress;
    document.getElementById('subject').value = doc.subject;
    document.getElementById('addressee').value = doc.addressee;
    document.getElementById('dateReleased').value = doc.dateReleased;
    document.getElementById('documentType').value = doc.documentType;
    document.getElementById('remarks').value = doc.remarks;

    modalTitle.textContent = 'Edit Document';
    documentModal.style.display = 'flex';
  }
}

// Delete document
function deleteDocument(id) {
  if (confirm('Are you sure you want to delete this document?')) {
    let documents = getDocuments();
    documents = documents.filter(doc => doc.id !== id);
    localStorage.setItem('documents', JSON.stringify(documents));
    loadDocuments();
  }
}
