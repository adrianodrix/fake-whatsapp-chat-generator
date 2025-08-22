export interface IconProps {
  name: 'edit' | 'check' | 'check-double' | 'close' | 'arrow-down';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  'aria-label'?: string;
}

export type IconName = IconProps['name'];
export type IconSize = NonNullable<IconProps['size']>;
