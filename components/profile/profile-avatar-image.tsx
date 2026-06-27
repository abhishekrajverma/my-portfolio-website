import Image from "next/image";
import { cn } from "@/lib/utils";

type ProfileAvatarImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
};

export function ProfileAvatarImage({
  src,
  alt,
  className,
  sizes,
  priority,
  fill,
  width,
  height,
}: ProfileAvatarImageProps) {
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={cn("object-cover", className)}
        sizes={sizes}
        priority={priority}
        quality={80}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 500}
      height={height ?? 500}
      className={cn("object-cover", className)}
      sizes={sizes}
      priority={priority}
      quality={80}
    />
  );
}
