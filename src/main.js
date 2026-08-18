import "./style.css";
import { countries } from "./countries.js";

const countrySelect = document.getElementById("country");
const dialCode      = document.getElementById("dial-code");
const phoneInput    = document.getElementById("phone");
const phoneError    = document.getElementById("phone-error");
const messageInput  = document.getElementById("message");
const generateBtn   = document.getElementById("generate");
const resultDiv     = document.getElementById("result");
const linkOutput    = document.getElementById("link-output");
const copyBtn       = document.getElementById("copy");

countries.forEach((c) => {
  const opt = document.createElement("option");
  opt.value = c.code;
  opt.textContent = `${c.name} (+${c.dial})`;
  countrySelect.appendChild(opt);
});

countrySelect.addEventListener("change", () => {
  const selected = countries.find((c) => c.code === countrySelect.value);
  dialCode.textContent = selected ? `+${selected.dial}` : "";
  phoneInput.focus();
  phoneError.hidden = true;
});

function cleanPhone(raw) {
  return raw.replace(/\D/g, "");
}

function isValidPhone(digits) {
  return digits.length >= 6 && digits.length <= 15;
}

function buildLink(phoneDigits, message) {
  let url = `https://wa.me/${phoneDigits}`;
  if (message.trim()) {
    url += `?text=${encodeURIComponent(message.trim())}`;
  }
  return url;
}

generateBtn.addEventListener("click", () => {
  const selected = countries.find((c) => c.code === countrySelect.value);
  if (!selected) {
    phoneError.textContent = "Please select a country code.";
    phoneError.hidden = false;
    return;
  }

  const digits = cleanPhone(phoneInput.value);
  if (!isValidPhone(digits)) {
    phoneError.textContent = "Please enter a valid phone number (digits only, at least 6 characters).";
    phoneError.hidden = false;
    return;
  }

  phoneError.hidden = true;
  const fullNumber = selected.dial + digits.replace(/^0+/, "");
  const link = buildLink(fullNumber, messageInput.value);

  linkOutput.href = link;
  linkOutput.textContent = link;
  resultDiv.hidden = false;
  copyBtn.textContent = "Copy Link";
});

copyBtn.addEventListener("click", async () => {
  const link = linkOutput.href;
  try {
    await navigator.clipboard.writeText(link);
    copyBtn.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.textContent = "Copy Link";
    }, 2000);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = link;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    copyBtn.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.textContent = "Copy Link";
    }, 2000);
  }
});
