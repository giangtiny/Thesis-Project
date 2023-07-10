export function getFirstAndLastDayOfYear() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const firstDayOfYear = new Date(currentYear, 0, 1);
  const lastDayOfYear = new Date(currentYear, 11, 31);

  return {
    firstDayOfYear: firstDayOfYear,
    lastDayOfYear: lastDayOfYear
  };
}