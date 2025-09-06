import React, { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  sizes: {
    webp: {
      desktop: string;
      mobile: string;
    };
    jpg: {
      desktop: string;
      mobile: string;
    };
  };
  placeholder?: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  style,
  sizes,
  placeholder,
  loading = 'lazy',
  fetchPriority = 'auto'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = (): void => {
    setIsLoaded(true);
  };

  const handleError = (): void => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* Blur placeholder */}
      {placeholder && !isLoaded && (
        <img
          src={placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-110 transition-opacity duration-300"
          aria-hidden="true"
        />
      )}
      
      {/* Main optimized image */}
      <picture className={`block w-full h-full ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
        {/* Modern WebP format for supported browsers */}
        <source 
          media="(min-width: 768px)" 
          srcSet={sizes.webp.desktop} 
          type="image/webp" 
        />
        <source 
          media="(max-width: 767px)" 
          srcSet={sizes.webp.mobile} 
          type="image/webp" 
        />
        {/* Fallback JPEG for older browsers */}
        <source 
          media="(min-width: 768px)" 
          srcSet={sizes.jpg.desktop} 
          type="image/jpeg" 
        />
        <source 
          media="(max-width: 767px)" 
          srcSet={sizes.jpg.mobile} 
          type="image/jpeg" 
        />
        {/* Final fallback */}
        <img 
          src={hasError ? src : sizes.jpg.desktop} 
          alt={alt}
          className="w-full h-full object-cover"
          loading={loading}
          decoding="async"
          fetchPriority={fetchPriority}
          onLoad={handleLoad}
          onError={handleError}
        />
      </picture>
    </div>
  );
};

export default OptimizedImage;
