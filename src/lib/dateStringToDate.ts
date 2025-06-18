export function dateStringToDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date;
}
