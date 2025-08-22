import type { InputHTMLAttributes } from 'react';

export interface DateTimeInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'onChange' | 'onError'
  > {
  type: 'date' | 'time';
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onError?: (error: string) => void;
}
