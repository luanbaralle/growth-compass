import { cn } from "@/lib/utils";
import { Building2, Camera, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";

const sizeClasses = {
  sm: "h-9 w-9 rounded-lg text-xs",
  md: "h-14 w-14 rounded-xl text-base",
  lg: "h-16 w-16 rounded-2xl text-lg sm:h-[4.25rem] sm:w-[4.25rem]",
};

export function CompanyAvatar({
  name,
  logoUrl,
  size = "md",
  editable,
  uploading,
  onUpload,
  onRemove,
}: {
  name: string;
  logoUrl?: string | null;
  size?: keyof typeof sizeClasses;
  editable?: boolean;
  uploading?: boolean;
  onUpload?: (file: File) => Promise<void>;
  onRemove?: () => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState(false);

  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const showImage = logoUrl && !imageError;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpload) return;
    await onUpload(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const inner = (
    <>
      {showImage ? (
        <img
          src={logoUrl}
          alt={`Logo ${name}`}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="font-bold">{initials || <Building2 className="h-5 w-5" />}</span>
      )}
      {editable && (
        <span className="company-avatar-overlay">
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </span>
      )}
    </>
  );

  if (editable && onUpload) {
    return (
      <div className="relative shrink-0">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className={cn("company-avatar company-avatar-editable", sizeClasses[size])}
          title="Alterar logo"
        >
          {inner}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFile}
        />
        {logoUrl && onRemove && (
          <button
            type="button"
            disabled={uploading}
            onClick={() => void onRemove()}
            className="company-avatar-remove"
            title="Remover logo"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("company-avatar shrink-0", sizeClasses[size])}>
      {inner}
    </div>
  );
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function resolveLogoMimeType(file: File): "image/jpeg" | "image/png" | "image/webp" | "image/gif" | null {
  if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp" || file.type === "image/gif") {
    return file.type;
  }
  return null;
}
