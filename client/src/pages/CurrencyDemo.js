import React, { useState } from 'react';
import { SalaryRangeDisplay, CurrencyDisplay, SalaryRangeInput } from '../components/UI/Currency';

const CurrencyDemo = () => {
  const [salary, setSalary] = useState({
    min: 500000,
    max: 1500000,
    currency: 'INR'
  });

  const [amount, setAmount] = useState(1000000);
  const [currency, setCurrency] = useState('INR');

  const sampleSalaries = [
    { min: 300000, max: 600000, currency: 'INR' },
    { min: 800000, max: 1200000, currency: 'INR' },
    { min: 1500000, max: 2500000, currency: 'INR' },
    { min: 50000, max: 80000, currency: 'USD' },
    { min: 45000, max: 75000, currency: 'GBP' },
    { min: 40000, max: 70000, currency: 'EUR' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Currency & INR Support Demo</h1>
        <p className="text-gray-600 mt-2">Comprehensive currency display and input with INR support</p>
      </div>

      {/* Currency Display Examples */}
      <div className="card">
        <div className="card-body">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Currency Display Examples</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">INR Examples</h3>
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded">
                  <CurrencyDisplay amount={100000} currency="INR" showCode={true} />
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <CurrencyDisplay amount={2500000} currency="INR" compact={true} />
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <CurrencyDisplay amount={850000} currency="INR" showDecimals={true} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">USD Examples</h3>
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded">
                  <CurrencyDisplay amount={75000} currency="USD" showCode={true} />
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <CurrencyDisplay amount={150000} currency="USD" compact={true} />
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <CurrencyDisplay amount={95000} currency="USD" showDecimals={true} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">Other Currencies</h3>
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded">
                  <CurrencyDisplay amount={65000} currency="EUR" showCode={true} />
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <CurrencyDisplay amount={55000} currency="GBP" showCode={true} />
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <CurrencyDisplay amount={85000} currency="CAD" showCode={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Range Examples */}
      <div className="card">
        <div className="card-body">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Salary Range Examples</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">Indian Market Salaries</h3>
              <div className="space-y-2">
                {sampleSalaries.filter(s => s.currency === 'INR').map((sal, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded flex justify-between items-center">
                    <span className="text-sm text-gray-600">Position {index + 1}</span>
                    <SalaryRangeDisplay salary={sal} showCode={true} compact={false} />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">International Salaries</h3>
              <div className="space-y-2">
                {sampleSalaries.filter(s => s.currency !== 'INR').map((sal, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded flex justify-between items-center">
                    <span className="text-sm text-gray-600">{sal.currency} Position {index + 1}</span>
                    <SalaryRangeDisplay salary={sal} showCode={true} compact={false} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Salary Input */}
      <div className="card">
        <div className="card-body">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Interactive Salary Input</h2>

          <div className="space-y-6">
            <SalaryRangeInput
              salary={salary}
              onChange={setSalary}
            />

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Current Salary Range:</h3>
              <SalaryRangeDisplay
                salary={salary}
                showCode={true}
                showDecimals={false}
                className="text-lg font-semibold text-blue-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Currency Converter Demo */}
      <div className="card">
        <div className="card-body">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Amount Display Demo</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="input"
                    min="0"
                    step="10000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="input"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Display Formats:</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Standard: </span>
                    <CurrencyDisplay amount={amount} currency={currency} />
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">With Code: </span>
                    <CurrencyDisplay amount={amount} currency={currency} showCode={true} />
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Compact: </span>
                    <CurrencyDisplay amount={amount} currency={currency} compact={true} />
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">With Decimals: </span>
                    <CurrencyDisplay amount={amount} currency={currency} showDecimals={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Supported Currencies */}
      <div className="card">
        <div className="card-body">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Supported Currencies</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">USD - US Dollar</div>
                  <div className="text-sm text-gray-500">Symbol: $</div>
                </div>
                <div className="text-2xl font-bold text-gray-700">$</div>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">INR - Indian Rupee</div>
                  <div className="text-sm text-gray-500">Symbol: ₹</div>
                </div>
                <div className="text-2xl font-bold text-gray-700">₹</div>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">EUR - Euro</div>
                  <div className="text-sm text-gray-500">Symbol: €</div>
                </div>
                <div className="text-2xl font-bold text-gray-700">€</div>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">GBP - British Pound</div>
                  <div className="text-sm text-gray-500">Symbol: £</div>
                </div>
                <div className="text-2xl font-bold text-gray-700">£</div>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">CAD - Canadian Dollar</div>
                  <div className="text-sm text-gray-500">Symbol: C$</div>
                </div>
                <div className="text-2xl font-bold text-gray-700">C$</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyDemo;
