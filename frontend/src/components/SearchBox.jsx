// SearchBox.jsx
import React, { useState } from 'react';
import { FaSearch }  from 'react-icons/fa';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword('');
    } else {
      navigate('/');
    }
  };

  return (
    <Form onSubmit={submitHandler} className='d-flex align-items-center'>
      <Form.Control
        type='text'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder='Search Groceries...'
        className='mr-2 mx-1' 
      />
      <Button type='submit' variant='outline-success'>
        <FaSearch  />
      </Button>
    </Form>
  );
};

export default SearchBox;
