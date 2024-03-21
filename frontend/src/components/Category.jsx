import React, { useRef, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import './Category.css'; // Import CSS for styling
import { useNavigate } from 'react-router-dom';

const Category = ({ categories }) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const scrollAmountRef = useRef(0);
  const scrollStep = 1;
  const scrollSpeed = 30; // Adjust speed as needed
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const totalWidth = container.scrollWidth - container.clientWidth;

    const scroll = () => {
      if (!isHovering) {
        container.scrollLeft += scrollStep;
        scrollAmountRef.current += scrollStep;

        // Check if reached the end of container
        if (scrollAmountRef.current >= totalWidth) {
          // Change direction to scroll back to start
          container.scrollTo({ left: 0, behavior: 'auto' });
          scrollAmountRef.current = 0;
        }
      }
    };

    // Start scrolling animation
    const interval = setInterval(scroll, scrollSpeed);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [isHovering]);

  const handleCategoryClick = (category) => {
    navigate(`/search/${category}`);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div
      className="category-container"
      ref={containerRef}
      style={{ overflowX: 'auto' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {categories.map((category, index) => (
        <Button
          key={index}
          className="outline-success"
          onClick={() => handleCategoryClick(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default Category;
