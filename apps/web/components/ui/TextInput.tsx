import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm text-slate-400 font-medium">
          {label}
        </label>
        
        <input
          ref={ref}
          className={`
            w-full px-3 py-2 rounded-md bg-transparent text-white border 
            focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors
            placeholder:text-slate-600
            ${error ? 'border-red-500' : 'border-slate-800'} 
            ${className}
          `}
          {...props}
        />
        
        {error && (
          <span className="text-xs text-red-500 mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;