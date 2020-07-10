import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';

import '../styles/index.css';

console.log('App Ready');

const Tile = ({
  content: {
    poster,
    title,
    year,
  }}) => (
  <div className="tile">
    <img src={poster} />
    <div>{`${title} (${year})`}</div>
    <div>Genres: </div>
  </div>
);

const Filter = () => (
  <select>
    <option>Option 1</option>
  </select>
);

const App = () => {
  const [ data, setData ] = useState([]);

  useEffect(() => {
    fetch('https://hubspotwebteam.github.io/CodeExercise/src/js/data/data.json')
    .then(res => res.json())
    .then(json => setData(json.media));
  }, [])

  return (
    <>
      <Filter />
      <Filter />
      {console.log(data)}

      { data && data.map((item) => (
        <Tile
          content={item}
        />
      ))}
    </>
  );
};

ReactDom.render(
  <App />,
  document.getElementById('app')
);
