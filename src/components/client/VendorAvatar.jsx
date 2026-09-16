import { Store } from "lucide-react";

export default function VendorAvatar({ logoUrl, name, size = 40 }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-flame-100 text-flame-500"
      style={{ width: size, height: size }}
    >
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        <Store className="h-1/2 w-1/2" strokeWidth={1.5} />
      )}
    </div>
  );
}
