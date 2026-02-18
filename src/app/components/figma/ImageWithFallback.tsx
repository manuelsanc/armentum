import { useState } from "react";
import fallbackImg from "../../../assets/isotipo.png";

type Props = {
  src: string;
  alt?: string;
  className?: string;
  fallback?: string;
};

export function ImageWithFallback({ src, alt = "", className = "", fallback = fallbackImg }: Props) {
  const [failed, setFailed] = useState(false);

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      src={failed ? fallback : src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

export default ImageWithFallback;
