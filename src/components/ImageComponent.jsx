/* eslint-disable react/prop-types */
import { useState } from "react";
// import brokenImg from "../assets/brokenimg.jpg";

const ImageWithFallback = ({ src, alt, className }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const fallbackSrc = "../assets/brokenimg.jpg"; // Replace with the URL of your broken image

  const handleImageError = () => {
    setImageSrc(fallbackSrc);
  };

  return (
    <img
      src={imageSrc}
      onError={handleImageError}
      alt={alt}
      className={className}
    />
  );
};

export default ImageWithFallback;
