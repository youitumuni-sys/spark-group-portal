import Image from 'next/image';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: AvatarSize;
  fallback?: string;
  className?: string;
}

const sizeMap: Record<AvatarSize, { container: string; px: number; text: string }> = {
  sm: { container: 'h-8 w-8', px: 32, text: 'text-xs' },
  md: { container: 'h-10 w-10', px: 40, text: 'text-sm' },
  lg: { container: 'h-14 w-14', px: 56, text: 'text-lg' },
  xl: { container: 'h-20 w-20', px: 80, text: 'text-xl' },
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function Avatar({
  src,
  alt,
  size = 'md',
  fallback,
  className,
}: AvatarProps) {
  const s = sizeMap[size];
  const initials = fallback || getInitials(alt);

  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-full border-2 border-gray-700 bg-gray-800',
        s.container,
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={s.px}
          height={s.px}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          className={cn(
            'flex h-full w-full items-center justify-center font-semibold text-amber-400',
            s.text,
          )}
        >
          {initials}
        </span>
      )}
    </div>
  );
}
