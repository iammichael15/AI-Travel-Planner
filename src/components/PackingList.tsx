import React, { useState } from 'react';
import { PackageCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { PackingItem } from '../types';

interface PackingListProps {
  items: PackingItem[];
}

function PackingList({ items }: PackingListProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['clothing']));

  const categories = Array.from(new Set(items.map(item => item.category)));

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const categoryIcons: Record<string, string> = {
    clothing: '👕',
    toiletries: '🧴',
    electronics: '📱',
    documents: '📄',
    miscellaneous: '🎒'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center mb-6">
        <PackageCheck className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-semibold text-gray-900">Packing List</h2>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category} className="border rounded-lg overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              onClick={() => toggleCategory(category)}
            >
              <div className="flex items-center">
                <span className="mr-2">{categoryIcons[category]}</span>
                <span className="font-medium text-gray-900 capitalize">{category}</span>
              </div>
              {expandedCategories.has(category) ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {expandedCategories.has(category) && (
              <div className="p-4">
                <ul className="space-y-2">
                  {items
                    .filter(item => item.category === category)
                    .map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center text-gray-700"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                        />
                        <span className="ml-3">
                          {item.name}
                          {item.essential && (
                            <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                              Essential
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          className="text-sm text-indigo-600 hover:text-indigo-800"
          onClick={() => window.print()}
        >
          Print Packing List
        </button>
      </div>
    </div>
  );
}

export default PackingList;