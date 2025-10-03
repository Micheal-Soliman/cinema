import React from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  disabled = false
}) => {
  return (
    <div className="max-w-3xl mx-auto mb-8 sm:mb-12 px-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 sm:pl-6 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full pl-12 sm:pl-14 pr-12 sm:pr-6 py-4 sm:py-5 text-base sm:text-lg
            bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl
            focus:ring-4 focus:ring-blue-100 focus:border-blue-500
            text-gray-900 placeholder-gray-500
            transition-all duration-300
            shadow-sm hover:shadow-md
            ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-75' : 'hover:border-gray-300'}
          `}
        />
        {value && !disabled && (
          <button
            onClick={() => onChange('')}
            className="absolute inset-y-0 right-0 pr-4 sm:pr-6 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
