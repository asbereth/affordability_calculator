const FREQUENCIES = {
  weekly: {
    periodsPerYear: 52,
    label: "week"
  },
  fortnightly: {
    periodsPerYear: 26,
    label: "fortnight"
  },
  monthly: {
    periodsPerYear: 12,
    label: "month"
  }
};

export function getFrequency(frequency) {
  const config = FREQUENCIES[frequency];

  if (!config) {
    throw new Error(`Unsupported repayment frequency: ${frequency}`);
  }

  return config;
}

export function calculateRepayment({
  loanAmount,
  annualInterestRate,
  loanTermYears,
  frequency = "monthly"
}) {
  assertPositiveNumber(loanAmount, "Loan amount");
  assertNonNegativeNumber(annualInterestRate, "Interest rate");
  assertPositiveNumber(loanTermYears, "Loan term");

  const { periodsPerYear } = getFrequency(frequency);
  const numberOfPayments = loanTermYears * periodsPerYear;
  const periodRate = annualInterestRate / 100 / periodsPerYear;

  if (periodRate === 0) {
    return loanAmount / numberOfPayments;
  }

  const growth = Math.pow(1 + periodRate, numberOfPayments);
  return (loanAmount * periodRate * growth) / (growth - 1);
}

export function calculateBorrowingCapacity({
  repaymentAmount,
  annualInterestRate,
  loanTermYears,
  frequency = "monthly"
}) {
  assertPositiveNumber(repaymentAmount, "Repayment amount");
  assertNonNegativeNumber(annualInterestRate, "Interest rate");
  assertPositiveNumber(loanTermYears, "Loan term");

  const { periodsPerYear } = getFrequency(frequency);
  const numberOfPayments = loanTermYears * periodsPerYear;
  const periodRate = annualInterestRate / 100 / periodsPerYear;

  if (periodRate === 0) {
    return repaymentAmount * numberOfPayments;
  }

  return (repaymentAmount * (1 - Math.pow(1 + periodRate, -numberOfPayments))) / periodRate;
}

export function calculateAffordabilitySummary({
  repaymentAmount,
  annualInterestRate,
  loanTermYears,
  frequency = "monthly",
  depositAmount = 0
}) {
  assertPositiveNumber(repaymentAmount, "Repayment amount");
  assertNonNegativeNumber(annualInterestRate, "Interest rate");
  assertPositiveNumber(loanTermYears, "Loan term");
  assertNonNegativeNumber(depositAmount, "Deposit");

  const { periodsPerYear } = getFrequency(frequency);
  const numberOfPayments = loanTermYears * periodsPerYear;
  const loanAmount = calculateBorrowingCapacity({
    repaymentAmount,
    annualInterestRate,
    loanTermYears,
    frequency
  });
  const totalRepaid = repaymentAmount * numberOfPayments;
  const propertyPrice = loanAmount + depositAmount;
  const lvr = propertyPrice > 0 ? loanAmount / propertyPrice : 1;

  return {
    frequency,
    periodsPerYear,
    repaymentAmount,
    loanAmount,
    depositAmount,
    propertyPrice,
    lvr,
    totalInterest: totalRepaid - loanAmount,
    totalRepaid,
    comparison: {
      weekly: calculateRepayment({
        loanAmount,
        annualInterestRate,
        loanTermYears,
        frequency: "weekly"
      }),
      fortnightly: calculateRepayment({
        loanAmount,
        annualInterestRate,
        loanTermYears,
        frequency: "fortnightly"
      }),
      monthly: calculateRepayment({
        loanAmount,
        annualInterestRate,
        loanTermYears,
        frequency: "monthly"
      })
    }
  };
}

function assertPositiveNumber(value, label) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be greater than zero.`);
  }
}

function assertNonNegativeNumber(value, label) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} cannot be negative.`);
  }
}
