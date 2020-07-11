import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';

import '../styles/index.css';

console.log('App Ready');

const Tile = ({
  content: {
    poster,
    title,
    year,
    genre,
  }}) => (
  <div className="tile">
    <img src={poster} />
    <div>{`${title} (${year})`}</div>
    <div>Genres: 
      { genre }
    </div>
  </div>
);

const Filter = ({ options }) => { 
  return (
  <select>
    { options && options.map(option => (
      <option key={option}>
        {option}
      </option>
    ))}
  </select>
)};

const getUniqueSet = (data, field) => [...new Set(data.map(obj => obj[field]))];

const transformData = (data) => {
  const yearSet = getUniqueSet(data, 'year');
  const typeSet = getUniqueSet(data, 'type');

  const genreSet = new Set();
  data.forEach(arr => 
    arr.genre.forEach(x => genreSet.add(x))
  );
  return {
    items: data,
    years: yearSet,
    types: typeSet,
    genre: [...genreSet],
  };
}

const App = () => {
  const [ data, setData ] = useState([]);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    fetch('https://hubspotwebteam.github.io/CodeExercise/src/js/data/data.json')
    .then(res => res.json())
    .then(json => {
      setData(transformData(json.media));
      setLoading(false);
    });
  }, [])

  return (
    <>
      { loading && 
        <div>
          Loading
        </div>
      }
      { !loading && 
      <>
        <Filter options={data.years}/>
        <Filter options={data.genre}/>

        { data && data.items && data.items.map((item) => (
          <Tile
            key={item.title}
            content={item}
          />
        ))}
      </>
      }
     
    </>
  );
};

ReactDom.render(
  <App />,
  document.getElementById('app')
);
