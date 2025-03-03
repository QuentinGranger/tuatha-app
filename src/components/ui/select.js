'use client';

export function Select({ value, onValueChange, items, placeholder }) {
  return (
    <select
      value={value || ''}
      onChange={(e) => onValueChange(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {items.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
}
