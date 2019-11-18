import React from 'react';


const ShowBook = ({book}) => (
  <div className="display-item">
      <div className="book-image">
        <img src={book.image} alt={`The cover of ${book.title}`}/>
      </div>
    <div className="right-panel">

        <h2>{book.title}</h2>
        <h3>{book.authors ? book.authors.map((author)=> author+ " "): ''}</h3>
        <h4>{book.price ? '$' + book.price : ''}</h4>
        <h4>{book.description}</h4>
        <br/>

        <a href={book.preview}>Have a look inside!</a>
        <br/><br/><br/>

    </div>

  </div>
);

export default ShowBook