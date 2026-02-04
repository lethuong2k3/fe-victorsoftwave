import React, { useState, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  alt, 
  fallbackSrc,
  className,
  ...props 
}) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  if (error || !src) {
    if (fallbackSrc) {
        return (
            <img
                src={fallbackSrc}
                alt={alt}
                className={className}
                {...props}
            />
        )
    }
    return (
      <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${className}`} title={alt}>
        <ImageIcon className="w-1/3 h-1/3 text-slate-300 dark:text-slate-600" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
};
