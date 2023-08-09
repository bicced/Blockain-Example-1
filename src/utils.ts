
export function roundedSum(num1: number, num2: number) {
  return Math.round((num1 + num2) * 10000) / 10000;
}

export function roundedSubtract(num1: number, num2: number) {
  return Math.round((num1 - num2) * 10000) / 10000;
}
