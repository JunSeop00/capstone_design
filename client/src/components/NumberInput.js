import React from 'react';

const NumberInput = ({ value, onChange, placeholder, errors }) => {
    const increment = () => onChange(Number(value || 0) + 1);
    const decrement = () => onChange(Number(value || 0) - 1);

    return (
        <div className={`flex w-full items-center border rounded-xl overflow-hidden ${errors ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}>
            <button
                type="button"
                onClick={decrement}
                className={`px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors`}
            >
                –
            </button>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full text-center py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none"
            />
            <button
                type="button"
                onClick={increment}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
                +
            </button>
        </div>
    );
};

export default NumberInput;
