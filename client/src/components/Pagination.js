import React from 'react';

export const Pagination = ({ moviesPerPage, totalMovies, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalMovies / moviesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
      <ul className= "pagination" style={{marginLeft:300}}>
        {pageNumbers.map(number => (
          <li key={number} className='waves-effect'>
            <a onClick={() => paginate(number)} className=''>
              {number}
            </a>
          </li>
        ))}
      </ul>
  );
};