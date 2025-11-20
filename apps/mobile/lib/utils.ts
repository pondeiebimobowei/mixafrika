import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from "dayjs";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (
  dateString: string | Date = '',
  format = "DD MMM, YYYY",
) => {
  if(!dateString) return;
  return dayjs(dateString).format(format);
};

export const formatCurrency = (price: number = 0) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price);
}