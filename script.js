document.getElementById("generateBtn").addEventListener("click", generateBarcode);
document.getElementById("printBtn").addEventListener("click", function() {
  const printableBarcode = document.getElementById('printableBarcode');
  const modalFooter = document.querySelector('.modal-footer');
  
  // Apply capture mode
  printableBarcode.classList.add('capture-mode');
  modalFooter.style.display = 'none';
  
  // Load html2canvas
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
  script.onload = function() {
    html2canvas(printableBarcode, {
      backgroundColor: '#ffffff',
      scale: 2,
      allowTaint: true,
      useCORS: true
    }).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `DENR_Barcode_${new Date().getTime()}.png`;
      link.click();
      
      // Remove capture mode
      printableBarcode.classList.remove('capture-mode');
      modalFooter.style.display = 'flex';
    });
  };
  document.head.appendChild(script);
});
document.getElementById("cancelBtn").addEventListener("click", function() {
  document.getElementById("barcodeModal").classList.remove("show");
  // Reset form
  document.getElementById("docType").value = "LETTER";
  document.getElementById("docDate").value = "";
});

function generateBarcode() {
  const docType = document.getElementById("docType").value;
  const docDate = document.getElementById("docDate").value;

  if (!docDate) {
    alert("Please select a document received date");
    return;
  }

  const dateObj = new Date(docDate);
  const formattedDate =
    String(dateObj.getMonth() + 1).padStart(2, '0') +
    String(dateObj.getDate()).padStart(2, '0') +
    dateObj.getFullYear().toString().slice(-2);

  const randomNumbers = String(Math.floor(Math.random() * 100000)).padStart(5, '0');

  const barcodeValue = `${formattedDate}-R6-${randomNumbers}`;

  JsBarcode("#barcode", barcodeValue, {
    format: "CODE128",
    lineColor: "#000",
    width: 2,
    height: 70,
    displayValue: true
  });

  JsBarcode("#barcodeSticker", barcodeValue, {
    format: "CODE128",
    lineColor: "#000",
    width: 1.2,
    height: 60,
    displayValue: false
  });

  document.getElementById("timestamp").textContent =
    "Barcode: " + barcodeValue;

  // Get current time (12-hour format with AM/PM)
  const now = new Date();
  const hours = now.getHours() % 12 || 12;
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
  const timeOnly = hours + ":" + minutes + ampm;

  document.getElementById("stickerTime").textContent = timeOnly;
  document.getElementById("stickerTimestamp").textContent = barcodeValue;
  document.getElementById("stickerDocType").textContent = docType;

  // Show modal
  document.getElementById("barcodeModal").classList.add("show");
}
