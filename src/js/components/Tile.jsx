import React from 'react';

const Tile = ({
  content: {
    poster,
    title,
    year,
    genre,
  }}) => (
  <li className="tile">
    <img src={poster} />
    <div>{`${title} (${year})`}</div>
    <div>Genres: 
      { genre }
    </div>
  </li>
);

export default Tile;
