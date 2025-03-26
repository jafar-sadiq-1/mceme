/**
 * Calculates financial year based on given date
 * @param {Date|string} date - Date object or date string
 * @returns {string} Financial year in format FY2024-2025
 */
export const getFinancialYear = (date) => {
  const d = new Date(date);
  const month = d.getMonth() + 1; // 1-12
  const year = d.getFullYear();
  
  // If month is January to March (1-3), it belongs to previous year's financial year
  const startYear = month <= 3 ? year - 1 : year;
  return `FY${startYear}-${startYear + 1}`;
};

/**
 * Checks if a date belongs to a specific financial year
 * @param {Date|string} date - Date to check
 * @param {string} financialYear - Financial year in format FY2024-2025
 * @returns {boolean}
 */
export const isInFinancialYear = (date, financialYear) => {
  const recordFY = getFinancialYear(date);
  return recordFY === financialYear;
};

/**
 * Gets current financial year
 * @returns {string} Current financial year in format FY2024-2025
 */
export const getCurrentFinancialYear = () => {
  return getFinancialYear(new Date());
};

/**
 * Gets list of recent financial years
 * @param {number} count - Number of years to return
 * @returns {string[]} Array of financial years
 */
export const getFinancialYearsList = (count = 5) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const years = [];
  
  for (let i = 0; i < count; i++) {
    const startYear = currentYear - i;
    years.push(`FY${startYear}-${startYear + 1}`);
  }
  
  return years;
};
