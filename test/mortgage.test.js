import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateAffordabilitySummary,
  calculateBorrowingCapacity,
  calculateRepayment
} from "../src/mortgage.js";

test("calculates a monthly principal and interest repayment", () => {
  const repayment = calculateRepayment({
    loanAmount: 800000,
    annualInterestRate: 6.19,
    loanTermYears: 30,
    frequency: "monthly"
  });

  assert.equal(Math.round(repayment), 4895);
});

test("handles zero interest loans", () => {
  const repayment = calculateRepayment({
    loanAmount: 120000,
    annualInterestRate: 0,
    loanTermYears: 10,
    frequency: "monthly"
  });

  assert.equal(repayment, 1000);
});

test("works backward from repayment amount to loan size", () => {
  const repayment = calculateRepayment({
    loanAmount: 800000,
    annualInterestRate: 6.19,
    loanTermYears: 30,
    frequency: "monthly"
  });
  const loanAmount = calculateBorrowingCapacity({
    repaymentAmount: repayment,
    annualInterestRate: 6.19,
    loanTermYears: 30,
    frequency: "monthly"
  });

  assert.equal(Math.round(loanAmount), 800000);
});

test("borrowing capacity handles zero interest loans", () => {
  const loanAmount = calculateBorrowingCapacity({
    repaymentAmount: 1000,
    annualInterestRate: 0,
    loanTermYears: 10,
    frequency: "monthly"
  });

  assert.equal(loanAmount, 120000);
});

test("adds deposit to estimate property price and lvr", () => {
  const summary = calculateAffordabilitySummary({
    repaymentAmount: 4000,
    annualInterestRate: 6,
    loanTermYears: 30,
    frequency: "monthly",
    depositAmount: 200000
  });

  assert.equal(Math.round(summary.propertyPrice), Math.round(summary.loanAmount + 200000));
  assert.ok(summary.lvr > 0);
  assert.ok(summary.lvr < 1);
});

test("rejects unsupported frequencies", () => {
  assert.throws(
    () =>
      calculateRepayment({
        loanAmount: 500000,
        annualInterestRate: 6,
        loanTermYears: 30,
        frequency: "daily"
      }),
    /Unsupported repayment frequency/
  );
});
