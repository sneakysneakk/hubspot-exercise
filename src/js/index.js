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
    genre: "",
    type: "",
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
    const filterKeys = Object.keys(filters);

    return originalData.filter(item => {
      return filterKeys.every(key => {
        if (!filters[key].length) return true;
        return item[key].includes(filters[key]);
      })
    })
  };

  const resetFilters = (e) => {
    e.preventDefault();
    setFilters({
      year: "",
      genre: "",
      type: "",
    });
  }

  const search = (term) => {
    if (term.length < 3) return setFilteredData(applyFilters());
    const searchResults = filteredData.filter(item => {
    return item.title.toLowerCase().includes(term);
  });
    console.log('searchResults', searchResults);

    setFilteredData(searchResults);

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

        <input type="text" onChange={e=>search(e.target.value)}/>

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
        
        { !filteredData.length && ( <h2>No results</h2>)}
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
