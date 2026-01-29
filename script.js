document.getElementById("generateBtn").addEventListener("click", generateBarcode);
document.getElementById("printBtn").addEventListener("click", function() {
  const svg = document.getElementById('barcodeSticker');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const svgData = new XMLSerializer().serializeToString(svg);
  const img = new Image();
  
  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `barcode_${new Date().getTime()}.png`;
    link.click();
  };
  
  img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  document.getElementById('barcodeModal').style.display = 'none';
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
