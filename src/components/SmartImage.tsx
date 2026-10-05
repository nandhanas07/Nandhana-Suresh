import React, { useState } from 'react';
import { Coffee } from 'lucide-react';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EFEFED] text-[#575753] p-6 text-center select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        <Coffee className="w-8 h-8 stroke-[1.25] text-[#1B4332] mb-2 opacity-80" />
        <span className="font-display text-base font-medium text-[#141413] line-clamp-2">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
};
