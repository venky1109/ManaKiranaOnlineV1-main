// SearchBox.jsx
import React, { useState, useEffect } from 'react';
import { FaSearch }  from 'react-icons/fa';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import suggestionsData from '../suggestions.json'; // Import the flat file

const SearchBox = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Filter suggestions based on input value
    const filteredSuggestions = suggestionsData.filter((suggestion) =>
        suggestion.toLowerCase().includes(keyword.toLowerCase())
    ).slice(0, 4); // Trim suggestions to 10
    setSuggestions(filteredSuggestions);
}, [keyword]); // Trigger whenever keyword changes


  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword('');
    } else {
      navigate('/');
    }
  };
  const handleSuggestionClick = (suggestion) => {
    navigate(`/search/${suggestion}`);
    setKeyword('');
    setSuggestions([]); // Clear suggestions after click
  };

  return (
    <div className="search-container">
      <Form onSubmit={submitHandler} className='d-flex align-items-center'>
        <Form.Control
          type='text'
          name='q'
          onChange={(e) => {
            setKeyword(e.target.value);
            // Filter suggestions based on input value
            const filteredSuggestions = suggestionsData.filter((suggestion) =>
              suggestion.toLowerCase().includes(e.target.value.toLowerCase())
            );
            setSuggestions(filteredSuggestions.slice(0, 10)); // Trim to 10 suggestions
          }}
          value={keyword}
          placeholder='Search Groceries...'
          className='mr-2 mx-1'
          autoComplete='off'
        />
        <Button type='submit' variant='outline-success'>
          <FaSearch />
        </Button>
      </Form>
      {/* Render suggestions */}
      {keyword !== '' && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
