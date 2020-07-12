import React, { useState } from 'react';

const Tile = ({
  content: {
    poster,
    title,
    year,
    genre,
  }}) => {

  const [ error, setError ] = useState(false)
  return (
    <li className="tile">
      <div className="tile__content">
        { error && (
          <div className="tile__image--default">
            Image for {title} is unavailable :(
          </div>
        )}
        { !error && 
          (<img className="tile__image" src={poster} onError={ () => setError(true)} />)
        }
        <div>{`${title} (${year})`}</div>
        <div>Genres: 
          { genre }
        </div>
      </div>
    </li>
  )
};

export default Tile;
