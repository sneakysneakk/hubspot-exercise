import React from 'react';

const Tile = ({
  content: {
    poster,
    title,
    year,
    genre,
  }}) => (
  <li className="tile">
    <div className="tile__content">
      <img className="tile__image" src={poster} onError={ e => {console.log(e)}} />
      <div>{`${title} (${year})`}</div>
      <div>Genres: 
        { genre }
      </div>
    </div>
  </li>
);

export default Tile;
