import { calculateAffordabilitySummary, getFrequency } from "./mortgage.js";

const form = document.querySelector("#mortgage-form");
const repaymentAmount = document.querySelector("#repayment-amount");
const interestRate = document.querySelector("#interest-rate");
const loanTerm = document.querySelector("#loan-term");
const depositAmount = document.querySelector("#deposit-amount");

const resultValue = document.querySelector("#results-title");
const frequencyLabel = document.querySelector("#frequency-label");
const propertyPrice = document.querySelector("#property-price");
const depositUsed = document.querySelector("#deposit-used");
const totalInterest = document.querySelector("#total-interest");
const loanToValue = document.querySelector("#loan-to-value");
const weeklyPayment = document.querySelector("#weekly-payment");
const fortnightlyPayment = document.querySelector("#fortnightly-payment");
const monthlyPayment = document.querySelector("#monthly-payment");

const currencyFormatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0
});

const percentFormatter = new Intl.NumberFormat("en-AU", {
  style: "percent",
  maximumFractionDigits: 1
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  updateResults();
});

form.addEventListener("input", () => {
  updateResults();
});

form.addEventListener("reset", () => {
  window.setTimeout(updateResults);
});

updateResults();

function updateResults() {
  const values = readValues();

  try {
    const summary = calculateAffordabilitySummary(values);
    renderSummary(summary);
    form.dataset.state = "valid";
  } catch (error) {
    form.dataset.state = "invalid";
    resultValue.textContent = "Check inputs";
    frequencyLabel.textContent = error.message;
  }
}

function readValues() {
  const frequency = new FormData(form).get("frequency");

  return {
    repaymentAmount: parseNumericValue(repaymentAmount),
    annualInterestRate: parseNumericValue(interestRate),
    loanTermYears: parseNumericValue(loanTerm),
    frequency,
    depositAmount: parseNumericValue(depositAmount)
  };
}

function renderSummary(summary) {
  const frequency = getFrequency(summary.frequency);

  resultValue.textContent = currencyFormatter.format(summary.loanAmount);
  frequencyLabel.textContent = `based on ${currencyFormatter.format(summary.repaymentAmount)} per ${frequency.label}`;
  propertyPrice.textContent = currencyFormatter.format(summary.propertyPrice);
  depositUsed.textContent = currencyFormatter.format(summary.depositAmount);
  totalInterest.textContent = currencyFormatter.format(summary.totalInterest);
  loanToValue.textContent = percentFormatter.format(summary.lvr);
  weeklyPayment.textContent = currencyFormatter.format(summary.comparison.weekly);
  fortnightlyPayment.textContent = currencyFormatter.format(summary.comparison.fortnightly);
  monthlyPayment.textContent = currencyFormatter.format(summary.comparison.monthly);
}

function parseNumericValue(input) {
  return Number(input.value);
}
