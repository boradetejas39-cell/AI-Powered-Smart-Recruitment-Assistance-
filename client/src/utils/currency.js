/**
 * Currency utility functions for AI Recruiter
 * Supports multiple currencies including INR
 */

export const CURRENCIES = {
  USD: {
    name: 'US Dollar',
    symbol: '$',
    code: 'USD',
    locale: 'en-US',
    position: 'before' // symbol comes before amount
  },
  INR: {
    name: 'Indian Rupee',
    symbol: '₹',
    code: 'INR',
    locale: 'en-IN',
    position: 'before' // symbol comes before amount
  },
  EUR: {
    name: 'Euro',
    symbol: '€',
    code: 'EUR',
    locale: 'de-DE',
    position: 'before' // symbol comes before amount
  },
  GBP: {
    name: 'British Pound',
    symbol: '£',
    code: 'GBP',
    locale: 'en-GB',
    position: 'before' // symbol comes before amount
  },
  CAD: {
    name: 'Canadian Dollar',
    symbol: 'C$',
    code: 'CAD',
    locale: 'en-CA',
    position: 'before' // symbol comes before amount
  }
};

/**
 * Format currency amount with proper symbol and formatting
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - Currency code (USD, INR, etc.)
 * @param {Object} options - Formatting options
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currencyCode = 'USD', options = {}) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${CURRENCIES[currencyCode]?.symbol || '$'}0`;
  }

  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const { 
    showCode = false, 
    showDecimals = true,
    compact = false 
  } = options;

  let formattedAmount;
  
  if (compact && amount >= 1000000) {
    formattedAmount = (amount / 1000000).toFixed(1) + 'M';
  } else if (compact && amount >= 1000) {
    formattedAmount = (amount / 1000).toFixed(1) + 'K';
  } else {
    formattedAmount = showDecimals 
      ? amount.toLocaleString(currency.locale, { 
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 
        })
      : amount.toLocaleString(currency.locale, { 
          maximumFractionDigits: 0 
        });
  }

  let result = '';
  
  if (currency.position === 'before') {
    result = `${currency.symbol}${formattedAmount}`;
  } else {
    result = `${formattedAmount}${currency.symbol}`;
  }

  if (showCode) {
    result += ` ${currency.code}`;
  }

  return result;
};

/**
 * Format salary range
 * @param {Object} salary - Salary object with min, max, currency
 * @param {Object} options - Formatting options
 * @returns {string} Formatted salary range
 */
export const formatSalaryRange = (salary, options = {}) => {
  if (!salary || (!salary.min && !salary.max)) {
    return 'Not specified';
  }

  const currency = salary.currency || 'USD';
  const { showCode = false, showDecimals = false, compact = false } = options;

  if (salary.min && salary.max) {
    if (salary.min === salary.max) {
      return formatCurrency(salary.min, currency, { showCode, showDecimals, compact });
    }
    return `${formatCurrency(salary.min, currency, { showCode: false, showDecimals, compact })} - ${formatCurrency(salary.max, currency, { showCode, showDecimals, compact })}${showCode ? ` ${currency}` : ''}`;
  } else if (salary.min) {
    return `${formatCurrency(salary.min, currency, { showCode, showDecimals, compact })}+${showCode ? ` ${currency}` : ''}`;
  } else if (salary.max) {
    return `Up to ${formatCurrency(salary.max, currency, { showCode, showDecimals, compact })}${showCode ? ` ${currency}` : ''}`;
  }

  return 'Not specified';
};

/**
 * Get currency options for select dropdown
 * @returns {Array} Array of currency options
 */
export const getCurrencyOptions = () => {
  return Object.entries(CURRENCIES).map(([code, currency]) => ({
    value: code,
    label: `${code} - ${currency.name}`,
    symbol: currency.symbol
  }));
};

/**
 * Convert currency (placeholder for future implementation)
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {number} Converted amount
 */
export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  // This is a placeholder - in a real app, you'd use an exchange rate API
  // For now, we'll return the same amount
  console.warn('Currency conversion not implemented yet');
  return amount;
};

/**
 * Get currency symbol by code
 * @param {string} currencyCode - Currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currencyCode) => {
  return CURRENCIES[currencyCode]?.symbol || '$';
};

/**
 * Validate currency code
 * @param {string} currencyCode - Currency code to validate
 * @returns {boolean} True if valid
 */
export const isValidCurrency = (currencyCode) => {
  return Object.keys(CURRENCIES).includes(currencyCode);
};

/**
 * Get default currency for user based on location or preferences
 * @param {string} userLocation - User's location
 * @returns {string} Default currency code
 */
export const getDefaultCurrency = (userLocation = 'US') => {
  // Simple logic - in a real app, you'd use more sophisticated detection
  if (userLocation === 'IN' || userLocation === 'India') {
    return 'INR';
  }
  return 'USD';
};
