import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, className = '', ...props }: InputProps) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label text-sm font-medium text-[#1E1E1E]">
          {label}
        </label>
      )}
      <input
        className={`form-control ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
      {helperText && !error && <div className="text-gray-500 text-sm mt-1">{helperText}</div>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Textarea({ label, error, helperText, className = '', ...props }: TextareaProps) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label text-sm font-medium text-[#1E1E1E]">
          {label}
        </label>
      )}
      <textarea
        className={`form-control ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
      {helperText && !error && <div className="text-gray-500 text-sm mt-1">{helperText}</div>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, helperText, options, className = '', ...props }: SelectProps) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label text-sm font-medium text-[#1E1E1E]">
          {label}
        </label>
      )}
      <select
        className={`form-control ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
      {helperText && !error && <div className="text-gray-500 text-sm mt-1">{helperText}</div>}
    </div>
  );
}

