import React, { useEffect, useCallback } from "react";

const ImageDecoder = React.memo(({ images, setDecodedImages }) => {
  const decodeBase64Image = useCallback((base64String) => {
    if (!base64String || typeof base64String !== "string") return null;

    // Если строка уже содержит data URI, возвращаем как есть
    if (/^data:image\/(png|jpeg|jpg|gif);base64,/.test(base64String)) {
      return base64String;
    }

    // Если это чистый base64 без префикса, добавляем стандартный PNG префикс
    if (/^[A-Za-z0-9+/]+={0,2}$/.test(base64String)) {
      return `data:image/png;base64,${base64String}`;
    }

    // Если строка не соответствует ни одному формату, возвращаем null
    return null;
  }, []);

  useEffect(() => {
    if (!images || images.length === 0) {
      setDecodedImages([]);
      return;
    }

    const processImages = () => {
      try {
        const normalizedImages = Array.isArray(images)
          ? images
          : [{ address: images }];

        const results = normalizedImages
          .map((img) => (img?.address ? decodeBase64Image(img.address) : null))
          .filter(Boolean);

        setDecodedImages(results);
      } catch (error) {
        console.error("Image decoding error:", error);
        setDecodedImages([]);
      }
    };

    const timer = setTimeout(processImages, 0);
    return () => clearTimeout(timer);
  }, [decodeBase64Image, images, setDecodedImages]);

  return null;
});

export default ImageDecoder;
