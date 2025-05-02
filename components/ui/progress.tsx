'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => {
    // Ensure value is a number and within valid range
    const safeValue = Math.min(Math.max(Number(value) || 0, 0), 100);
    
    return (
      <div
        ref={ref}
        className={cn(
          'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
          className
        )}
        {...props}
      >
        <div
          className="h-full w-full flex-1 bg-primary transition-all"
          style={{ 
            width: `${safeValue}%`,
            transform: `translateX(-${100 - safeValue}%)`,
            backgroundImage: 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.7) 100%)'
          }}
        />
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
