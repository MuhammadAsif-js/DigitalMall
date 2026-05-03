import React, { forwardRef } from 'react';

export interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** * Disables the button and replaces the children with an SVG loading spinner. 
   */
  isLoading?: boolean;
  /** * Controls the visual style of the button.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary';
}

const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  (
    { 
      className = '', 
      variant = 'primary', 
      isLoading = false, 
      children, 
      disabled, 
      ...props 
    }, 
    ref
  ) => {
    // Base classes tuned for a strict dark mode aesthetic
    const baseStyles = 
      "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 " +
      "disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

    // Variant-specific styling
    const variantStyles = {
      primary: "bg-white text-slate-950 hover:bg-slate-200 focus-visible:ring-slate-300",
      secondary: "bg-slate-800 text-white hover:bg-slate-700 focus-visible:ring-slate-400"
    };

    // Combine standard styles, the selected variant, and any custom classes passed in via props
    const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${className}`.trim();

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={combinedClasses}
        {...props}
      >
        {isLoading ? (
          <svg
            className="h-5 w-5 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          children
        )}
      </button>
    );
  }
);

PrimaryButton.displayName = 'PrimaryButton';

export default PrimaryButton;