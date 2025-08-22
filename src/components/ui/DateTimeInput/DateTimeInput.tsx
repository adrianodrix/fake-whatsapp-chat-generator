import React, { useState, useEffect, memo } from 'react';
import type { DateTimeInputProps } from './DateTimeInput.types';

/**
 * Cross-browser compatible date and time input components
 * Addresses TECH-002 risk from QA assessment
 */
export const DateTimeInput: React.FC<DateTimeInputProps> = memo(
  ({
    type,
    value,
    onChange,
    onError,
    className = '',
    disabled = false,
    placeholder,
    ...inputProps
  }) => {
    const [hasNativeSupport, setHasNativeSupport] = useState(true);
    const [fallbackValue, setFallbackValue] = useState(value);

    // Check for native HTML5 input support
    useEffect(() => {
      const input = document.createElement('input');
      input.type = type;

      // If browser doesn't support the input type, it falls back to 'text'
      const supportsType = input.type === type;
      setHasNativeSupport(supportsType);

      if (!supportsType) {
        console.warn(`Native ${type} input not supported, using fallback`);
      }
    }, [type]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;

      // Validate based on type
      if (!hasNativeSupport) {
        const validationResult = validateFallbackInput(type, newValue);
        if (!validationResult.isValid) {
          onError?.(validationResult.error!);
          return;
        }
      }

      setFallbackValue(newValue);
      onChange(event);
    };

    // For browsers with native support, use HTML5 inputs directly
    if (hasNativeSupport) {
      return (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={disabled}
          placeholder={placeholder}
          {...inputProps}
        />
      );
    }

    // Fallback for browsers without native support
    return (
      <div className="relative">
        <input
          type="text"
          value={fallbackValue}
          onChange={handleChange}
          className={`${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={disabled}
          placeholder={getFallbackPlaceholder(type, placeholder)}
          {...inputProps}
        />
        {type === 'date' && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <CalendarIcon className="h-4 w-4 text-gray-400" />
          </div>
        )}
        {type === 'time' && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ClockIcon className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>
    );
  }
);

/**
 * Validate fallback input values
 */
function validateFallbackInput(
  type: string,
  value: string
): { isValid: boolean; error?: string } {
  if (!value.trim()) {
    return { isValid: true }; // Empty values are valid (optional)
  }

  switch (type) {
    case 'date': {
      // Validate YYYY-MM-DD format
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(value)) {
        return {
          isValid: false,
          error: 'Data deve estar no formato YYYY-MM-DD (ex: 2025-08-22)',
        };
      }

      // Validate actual date
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return {
          isValid: false,
          error: 'Data inválida',
        };
      }

      return { isValid: true };
    }

    case 'time': {
      // Validate HH:MM format
      const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timePattern.test(value)) {
        return {
          isValid: false,
          error: 'Horário deve estar no formato HH:MM (ex: 14:30)',
        };
      }

      return { isValid: true };
    }

    default:
      return { isValid: true };
  }
}

/**
 * Get appropriate placeholder for fallback inputs
 */
function getFallbackPlaceholder(
  type: string,
  customPlaceholder?: string
): string {
  if (customPlaceholder) {
    return customPlaceholder;
  }

  switch (type) {
    case 'date':
      return 'YYYY-MM-DD (ex: 2025-08-22)';
    case 'time':
      return 'HH:MM (ex: 14:30)';
    default:
      return '';
  }
}

/**
 * Simple calendar icon for fallback
 */
const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

/**
 * Simple clock icon for fallback
 */
const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

DateTimeInput.displayName = 'DateTimeInput';
