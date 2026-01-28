document.getElementById("generateBtn").addEventListener("click", generateBarcode);
document.getElementById("printBtn").addEventListener("click", function() {
  window.print();
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
    width: 0.7,
    height: 30,
    displayValue: false
  });

  document.getElementById("timestamp").textContent =
    "Barcode: " + barcodeValue;

  // Extract date (YYYY-MM-DD -> show as MM/DD/YY format)
  const dateOnly = dateObj.getMonth() + 1 + "/" + dateObj.getDate().toString().padStart(2, '0') + "/" + dateObj.getFullYear().toString().slice(-2);

  // Get current time (HH:MM)
  const now = new Date();
  const timeOnly = String(now.getHours()).padStart(2, '0') + ":" + String(now.getMinutes()).padStart(2, '0');

  document.getElementById("stickerTime").textContent = timeOnly;
  document.getElementById("stickerTimestamp").textContent = barcodeValue;
  document.getElementById("stickerDocType").textContent = docType;

  document.getElementById("printBtn").style.display = "block";
  document.getElementById("printableBarcode").style.display = "block";
}
