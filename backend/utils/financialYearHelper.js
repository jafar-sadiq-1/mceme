const getFinancialYear = (date) => {
  const d = new Date(date);
  const month = d.getMonth() + 1; // getMonth() returns 0-11
  const year = d.getFullYear();
  const startYear = month <= 3 ? year - 1 : year;
  return `FY${startYear}-${startYear + 1}`;
};

module.exports = {
  getFinancialYear
};
