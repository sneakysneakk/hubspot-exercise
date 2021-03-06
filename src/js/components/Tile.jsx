import React, { useState } from "react";

const Tile = ({ content: { poster, title, year, genre } }) => {
  const [error, setError] = useState(false);

  const formattedGenres = genre.join(", ");
  return (
    <li className="tile" data-testid="app-tile">
      <div className="tile__content">
        {error && (
          <div className="tile__image tile__image--default">
            Image for {title} is unavailable :(
          </div>
        )}
        {!error && (
          <img
            className="tile__image"
            src={poster}
            onError={() => setError(true)}
          />
        )}
        <div>{`${title} (${year})`}</div>
        <div className="tile__genres">{`Genres: ${formattedGenres}`}</div>
      </div>
    </li>
  );
};

export default Tile;
