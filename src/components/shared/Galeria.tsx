import React from "react";

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  return (
    <div className="w-24 bg-gray-100 mr-2.5 p-2">
      {images.map((imageUri, index) => (
        <img
          key={index}
          src={imageUri}
          alt={`image-${index}`}
          className="w-full h-20 mb-2.5 object-cover"
        />
      ))}
    </div>
  );
};

export default ImageGallery;
