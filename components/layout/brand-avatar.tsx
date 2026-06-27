import { ProfileAvatarImage } from "@/components/profile/profile-avatar-image";
import { cn } from "@/lib/utils";

type BrandAvatarProps = {
  avatarUrl: string;
  alt: string;
  size?: "sm" | "md";
  className?: string;
};

const sizeClasses = {
  sm: "h-8 w-8 rounded-lg",
  md: "h-10 w-10 rounded-xl",
};

export function BrandAvatar({
  avatarUrl,
  alt,
  size = "sm",
  className,
}: BrandAvatarProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden ring-1 ring-border/80",
        sizeClasses[size],
        className
      )}
    >
      <ProfileAvatarImage
        src={avatarUrl}
        alt={alt}
        fill
        sizes={size === "sm" ? "32px" : "40px"}
      />
    </div>
  );
}
