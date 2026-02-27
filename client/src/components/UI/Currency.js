import React from 'react';
import { formatCurrency, formatSalaryRange, getCurrencySymbol, getCurrencyOptions } from '../../utils/currency';

/**
 * Currency Display Component
 * Displays formatted currency amounts and salary ranges
 */
export const CurrencyDisplay = ({
  amount,
  currency = 'USD',
  showCode = false,
  showDecimals = true,
  compact = false,
  className = ''
}) => {
  const formatted = formatCurrency(amount, currency, { showCode, showDecimals, compact });

  return (
    <span className={`currency-display ${className}`}>
      {formatted}
    </span>
  );
};

/**
 * Salary Range Display Component
 * Displays formatted salary ranges
 */
export const SalaryRangeDisplay = ({
  salary,
  showCode = false,
  showDecimals = false,
  compact = false,
  className = ''
}) => {
  const formatted = formatSalaryRange(salary, { showCode, showDecimals, compact });

  return (
    <span className={`salary-range ${className}`}>
      {formatted}
    </span>
  );
};

/**
 * Currency Symbol Component
 * Displays just the currency symbol
 */
export const CurrencySymbol = ({ currency = 'USD', className = '' }) => {
  const symbol = getCurrencySymbol(currency);

  return (
    <span className={`currency-symbol ${className}`}>
      {symbol}
    </span>
  );
};

/**
 * Salary Input Component
 * Input field for salary amounts with currency selector
 */
export const SalaryInput = ({
  value,
  onChange,
  currency,
  onCurrencyChange,
  placeholder = '0',
  min = 0,
  max = 10000000,
  step = 1000,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`salary-input-group ${className}`}>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : '')}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="input flex-1"
        />
        {onCurrencyChange && (
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            className="input w-auto"
            disabled={disabled}
          >
            <option value="USD">USD</option>
            <option value="INR">INR</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="CAD">CAD</option>
          </select>
        )}
      </div>
    </div>
  );
};

/**
 * Salary Range Input Component
 * Input fields for salary min/max with single currency selector
 */
export const SalaryRangeInput = ({
  salary,
  onChange,
  disabled = false,
  className = ''
}) => {
  const handleMinChange = (min) => {
    onChange({ ...salary, min });
  };

  const handleMaxChange = (max) => {
    onChange({ ...salary, max });
  };

  const handleCurrencyChange = (currency) => {
    onChange({ ...salary, currency });
  };

  return (
    <div className={`salary-range-input ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Salary
          </label>
          <input
            type="number"
            value={salary?.min || ''}
            onChange={(e) => handleMinChange(e.target.value ? parseFloat(e.target.value) : '')}
            placeholder="50000"
            min="0"
            step="1000"
            disabled={disabled}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Salary
          </label>
          <input
            type="number"
            value={salary?.max || ''}
            onChange={(e) => handleMaxChange(e.target.value ? parseFloat(e.target.value) : '')}
            placeholder="100000"
            min="0"
            step="1000"
            disabled={disabled}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            value={salary?.currency || 'INR'}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="input"
            disabled={disabled}
          >
            <option value="USD">USD - US Dollar</option>
            <option value="INR">INR - Indian Rupee</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="CAD">CAD - Canadian Dollar</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const CurrencyComponents = {
  CurrencyDisplay,
  SalaryRangeDisplay,
  CurrencySymbol,
  SalaryInput,
  SalaryRangeInput,
  getCurrencyOptions
};

export default CurrencyComponents;
