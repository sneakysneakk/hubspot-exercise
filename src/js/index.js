import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';

import '../styles/index.css';

const getUniqueSet = (data, field) => [...new Set(data.map(obj => obj[field]))];

const getGenreSet = (data) => {
  const genreSet = new Set();
  data.forEach(arr => 
    arr.genre.forEach(x => genreSet.add(x))
  );
  return [...genreSet];
}

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

const Dropdown = ({ options, addFilter, field, value }) =>  { 
  return (
  <select value={value} onChange={ e => addFilter(e.target.value, field)}>
     <option
        key="blank"
        value=""
      ></option>
    { options && options.map(option => (
      <option
        key={option}
        value={option}
      >
        {option}
      </option>
    ))}
  </select>
)};


const App = () => {
  const [ filteredData, setFilteredData ] = useState([]);
  const [ originalData, setOriginalData ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ years, setYears ] = useState([]);
  const [ genres, setGenres ] = useState([]);
  const [ filters, setFilters ] = useState({
    year: "",
    type: "",
    // genre: "",
  })

  useEffect(() => {
    fetch('https://hubspotwebteam.github.io/CodeExercise/src/js/data/data.json')
    .then(res => res.json())
    .then(json => {
      setYears(getUniqueSet(json.media, 'year'));
      setGenres(getGenreSet(json.media));
      setOriginalData(json.media);
      setFilteredData(json.media);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setFilteredData(applyFilters());
  }, [filters]);

  const addFilter = (filter, field) => {
    setFilters({
      ...filters,
      [field]: filter,
    });
  };

  const applyFilters = () => {
    console.log('filters', filters);
    const filterKeys = Object.keys(filters);

    return originalData.filter(item => {
      return filterKeys.every(key => {
        // if (typeof filters[key] !== 'function') return true;
        // return filters[key](item[key]);
      })
    })
    // return;
  };

  const resetFilters = (e) => {
    e.preventDefault();
    setFilters({
      year: "",
      type: "",
      // genre: "",
    });
  }

  return (
    <>
    
      { loading && 
        <div>
          Loading
        </div>
      }
      { !loading && 
      <>

      {console.log('filtered', filteredData)}

        <Dropdown
          options={years}
          addFilter={addFilter}
          field="year"
          value={filters.year}
        />
        <Dropdown
          options={genres}
          addFilter={addFilter}
          field="genre"
          value={filters.genre}
        />

        <button onClick={(e=>resetFilters(e))}>Clear filters</button>
        
        {/* { data.types.map(x => (
          <>
            <input type="radio" name="type" value={x} />
            <label>{x}</label>
          </>
        ))} */}
        <div onChange={(e)=> addFilter(e.target.value, 'type')}>
          <input id="bookradio" type="radio" name="type" value="book" />
          <label htmlFor="bookradio">Books</label>
          <input id="movieradio" type="radio" name="type" value="movie" />
          <label htmlFor="movieradio">Movies</label>
        </div>
        

        { filteredData && filteredData.map((item) => (
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
