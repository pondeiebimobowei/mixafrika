import { Decimal } from 'decimal.js';

export interface InstallmentPlan {
  regularAmount: number; 
  finalAmount: number;   
}


export function calculateInstallmentSplit(totalAmount: number, duration: number): InstallmentPlan {
  const total = new Decimal(totalAmount);
  const days = new Decimal(duration);

  const regularDecimal = total.div(days).floor();
  const regularAmount = regularDecimal.toNumber();
  
  const remainderDecimal = total.mod(days);

  const finalDecimal = regularDecimal.add(remainderDecimal);
  const finalAmount = finalDecimal.toNumber();

  if (regularAmount * (duration - 1) + finalAmount !== totalAmount) {
     throw new Error("Calculation integrity check failed.");
  }

  return { regularAmount, finalAmount };
}