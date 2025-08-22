import React, { useEffect, useState } from 'react';

interface DateTimeInputProps {
  type: 'date' | 'time';
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  pattern?: string;
  disabled?: boolean;
  id?: string;
}

/**
 * Date/Time input with browser compatibility fallback
 */
export const DateTimeInput: React.FC<DateTimeInputProps> = ({
  type,
  value,
  onChange,
  className,
  placeholder,
  pattern,
  disabled,
  id,
}) => {
  const [supportedType, setSupportedType] = useState<'date' | 'time' | 'text'>(
    type
  );

  useEffect(() => {
    // Test browser support for HTML5 date/time inputs
    const testInput = document.createElement('input');
    testInput.type = type;

    // If browser doesn't support the type, it will fallback to 'text'
    if (testInput.type === 'text') {
      setSupportedType('text');
    } else {
      setSupportedType(type);
    }
  }, [type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // For fallback text inputs, provide appropriate placeholder and pattern
  const getFallbackProps = () => {
    if (supportedType === 'text') {
      if (type === 'date') {
        return {
          placeholder: placeholder || 'YYYY-MM-DD',
          pattern: pattern || '\\d{4}-\\d{2}-\\d{2}',
          title: 'Formato: YYYY-MM-DD (ex: 2023-12-25)',
        };
      } else if (type === 'time') {
        return {
          placeholder: placeholder || 'HH:MM',
          pattern: pattern || '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
          title: 'Formato: HH:MM (ex: 14:30)',
        };
      }
    }
    return {
      placeholder,
      pattern,
    };
  };

  const fallbackProps = getFallbackProps();

  return (
    <>
      <input
        id={id}
        type={supportedType}
        value={value}
        onChange={handleChange}
        className={className}
        disabled={disabled}
        {...fallbackProps}
      />
      {supportedType === 'text' && (
        <small className="text-xs text-gray-500 mt-1">
          {type === 'date' && 'Use formato YYYY-MM-DD (ex: 2023-12-25)'}
          {type === 'time' && 'Use formato HH:MM (ex: 14:30)'}
        </small>
      )}
    </>
  );
};
