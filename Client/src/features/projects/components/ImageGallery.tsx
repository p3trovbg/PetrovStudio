import { useState } from 'react';
import './ImageGallery.css';

interface ImageGalleryProps {
  images: string[];
  alt?: string;
}

export default function ImageGallery({ images, alt = 'Gallery image' }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const closeLightbox = () => setSelectedIndex(null);

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <>
      <div className="gallery-grid" id="image-gallery">
        {images.map((src, index) => (
          <button
            key={index}
            className="gallery-item"
            onClick={() => setSelectedIndex(index)}
            id={`gallery-item-${index}`}
          >
            <img src={src} alt={`${alt} ${index + 1}`} loading="lazy" />
          </button>
        ))}
      </div>

      {selectedIndex !== null && (
        <div className="lightbox" id="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} id="lightbox-close">
            ✕
          </button>

          {images.length > 1 && (
            <>
              <button className="lightbox-nav lightbox-prev" onClick={goPrev}>
                ‹
              </button>
              <button className="lightbox-nav lightbox-next" onClick={goNext}>
                ›
              </button>
            </>
          )}

          <img
            src={images[selectedIndex]}
            alt={`${alt} ${selectedIndex + 1}`}
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="lightbox-counter">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
