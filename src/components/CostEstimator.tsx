import React from 'react';
import { DollarSign } from 'lucide-react';
import { CostEstimate } from '../types';

interface CostEstimatorProps {
  estimate: CostEstimate;
}

function CostEstimator({ estimate }: CostEstimatorProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: estimate.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const categories = [
    { name: 'Accommodation', amount: estimate.accommodation },
    { name: 'Transportation', amount: estimate.transportation },
    { name: 'Activities', amount: estimate.activities },
    { name: 'Food', amount: estimate.food },
    { name: 'Miscellaneous', amount: estimate.miscellaneous },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
      <div className="flex items-center mb-6">
        <DollarSign className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-semibold text-gray-900">Cost Estimate</h2>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.name} className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">{category.name}</span>
            <span className="font-medium text-gray-900">{formatCurrency(category.amount)}</span>
          </div>
        ))}

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span className="text-lg font-bold text-indigo-600">{formatCurrency(estimate.total)}</span>
        </div>
      </div>

      <div className="mt-6 bg-indigo-50 rounded-lg p-4">
        <p className="text-sm text-indigo-700">
          This estimate is based on average prices for your selected budget level. Actual costs may vary depending on specific choices and market conditions.
        </p>
      </div>
    </div>
  );
}

export default CostEstimator;