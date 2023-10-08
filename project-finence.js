function showLoanDetails(loanaccountnumber) {
  let xmlhttp1 = new XMLHttpRequest();
  // let xmlhttp = new XMLHttpRequest();
  url = `http://localhost:8080/loanAccount/${loanaccountnumber}`;
  xmlhttp1.open("GET", url);
  xmlhttp1.setRequestHeader("content-type", "application/json");
  var authToken = JSON.parse(localStorage.getItem("userDetails"))["token"];
  xmlhttp1.setRequestHeader("Authorization", `Bearer ${authToken}`);
  console.log(data);
  xmlhttp1.send();
  xmlhttp1.onload = function () {
    // .labelApplyLoan{
    let response = JSON.parse(xmlhttp1.responseText);

    tableText = `<table><tbody> `;
    tableText += `<tr><td class= "labelApplyLoan">Loan Account Number:</td>  <td class= "inputApplyLoan"> ${response.loan_account_number} </td> <td class= "labelApplyLoan">Manager ID:</td>  <td class= "inputApplyLoan"> ${response.manager_id} </td> </tr>`;
    tableText += `<tr><td class= "labelApplyLoan">Loan Application Number:</td>  <td class= "inputApplyLoan"> ${response.loan_application_number} </td> <td class= "labelApplyLoan">Customer ID:</td>  <td class= "inputApplyLoan"> ${response.customer_id} </td> </tr>`;
    tableText += `<tr><td class= "labelApplyLoan">Sanctioned Amount:</td>  <td class= "inputApplyLoan"> ${response.sanctioned_amount} </td> <td class= "labelApplyLoan">Disbursed Amount:</td>  <td class= "inputApplyLoan"> ${response.disbursed_amount} </td> </tr>`;
    tableText += `<tr><td class= "labelApplyLoan">Outstanding Balance:</td>  <td class= "inputApplyLoan"> ${response.outstanding_balance} </td> </tr>`;
    tableText += `<tr><td class= "labelApplyLoan">Principle Paid:</td>  <td class= "inputApplyLoan"> ${response.priciple_paid} </td> <td class= "labelApplyLoan">Interest Paid:</td>  <td class= "inputApplyLoan"> ${response.interest_paid} </td> </tr>`;
    tableText += `<tr><td class= "labelApplyLoan">Loan Tenure:</td>  <td class= "inputApplyLoan"> ${response.loan_tenure} </td> <td class= "labelApplyLoan">tenure Remaining:</td>  <td class= "inputApplyLoan"> ${response.tenure_remaining} </td> </tr>`;
    tableText += `<tr><td class= "labelApplyLoan">EMI:</td>  <td class= "inputApplyLoan"> ${response.emi} </td> <td class= "labelApplyLoan">Rate of Interest:</td>  <td class= "inputApplyLoan"> ${response.roi} </td> </tr>`;
    tableText += ` </tbody></table>`;

    tableText += `<br> <div id="transactionTableTitle"> Transactions <div>
<table class="table table-bordered">
<tr>
<th>Transaction ID</th>
<th>Loan Account Number</th>
<th>Amount</th>
<th>Date</th>
</tr>

`;

    let transactionRequest = new XMLHttpRequest();
    let transactionURl =
      (url = `http://localhost:8080/transaction/${loanaccountnumber}`);
    transactionRequest.open("GET", url);
    transactionRequest.setRequestHeader("content-type", "application/json");
    var authToken = JSON.parse(localStorage.getItem("userDetails"))["token"];
    transactionRequest.setRequestHeader("Authorization", `Bearer ${authToken}`);
    transactionRequest.send();
    transactionRequest.onload = function () {
      let transactionResponse = JSON.parse(transactionRequest.responseText);
      console.log(transactionResponse);
      for (transaction of transactionResponse) {
        tableText += `<tr><td>${transaction.transaction_id}</td><td>${transaction.loan_account_number}</td><td>${transaction.transaction_amount}</td><td>${transaction.date_of_transaction}</td></tr>`;
      }
      tableText += `<tbody id="tabdata"></tbody></table>`;

      Swal.fire({
        title: "<i>Loan Account Details</i>",
        html: tableText,
        confirmButtonText: "OK",
        confirmButtonColor: "orange",
        customClass: "swal-wide",
      });
    };
  };
}

function ViewDocument(loan_application_number) {
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.open(
    "GET",
    `http://localhost:8080/loanApplication/number1/${loan_application_number}`
  );
  var authToken = JSON.parse(localStorage.getItem("userDetails"))["token"];
  xmlhttp.setRequestHeader("Authorization", `Bearer ${authToken}`);
  xmlhttp.send();
  xmlhttp.onload = function () {
    let data = JSON.parse(xmlhttp.responseText);
    let fileBytes = data.fileBytes;
    loadAndDisplayPDF(fileBytes);
  };
}

// Define a function to load and display the PDF
function loadAndDisplayPDF(fileBytes) {
  document.getElementById("pdf-container").style.display = "block";
  document.createElement("canvas").innerHTML = "";
  // Convert Base64 to Uint8Array
  const pdfData = atob(fileBytes);
  const dataArray = new Uint8Array(pdfData.length);
  for (let i = 0; i < pdfData.length; i++) {
    dataArray[i] = pdfData.charCodeAt(i);
  }

  // Load the PDF using pdf.js
  pdfjsLib.getDocument(dataArray).promise.then(function (pdfDoc) {
    // Set up the container for rendering
    const pdfContainer = document.getElementById("pdf-container");

    // Loop through all pages and display them
    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      pdfDoc.getPage(pageNum).then(function (page) {
        // Create a container for each page
        const pageContainer = document.createElement("div");
        pageContainer.className = "page-container";

        // Create a canvas for rendering
        const canvas = document.createElement("canvas");
        pageContainer.appendChild(canvas);
        pdfContainer.appendChild(pageContainer);

        const context = canvas.getContext("2d");

        // Display the page on the canvas
        const viewport = page.getViewport({ scale: 1.0 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        page.render(renderContext);
      });
    }
  });
}
