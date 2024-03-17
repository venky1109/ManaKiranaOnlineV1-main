import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import './advertise.css';

const AdvertiseBanner = ({ images, height = '100%', width = '100%' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); // Change image every 10 seconds

    return () => clearInterval(interval);
  }, [images]);

  const currentImage = images.length > 0 ? images[currentIndex].image : null;

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <Container className='banner-container'>
      {currentImage && (
        <img
          className="banner-image"
          style={{ height, width }}
          src={currentImage}
          alt={`Banner ${currentIndex + 1}`}
        />
      )}
      {/* Navigation dots */}
      <div className="dot-container">
        {images.map((_, index) => (
          <div
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </Container>
  );
};

export default AdvertiseBanner;
