import { ButtonHTMLAttributes, FC, ReactNode } from 'react';

/**
 * Button component for consistent styling and accessibility.
 * @param children - Button content
 * @param className - Additional Tailwind classes
 * @param rest - Other button props
 */
type ButtonProps = {
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: FC<ButtonProps> = ({ children, className = '', ...rest }) => (
  <button
    className={`px-4 py-2 rounded bg-primary text-white font-semibold shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors ${className}`}
    tabIndex={0}
    aria-label={rest['aria-label']}
    {...rest}
  >
    {children}
  </button>
);

export default Button; 