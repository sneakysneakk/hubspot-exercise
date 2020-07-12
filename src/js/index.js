import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';

import Tile from './components/Tile'
import Dropdown from './components/Dropdown'

import '../styles/index.css';

const getUniqueSet = (data, field) => [...new Set(data.map(obj => obj[field]))].sort();

const getGenreSet = (data) => {
  const genreSet = new Set();
  data.forEach(arr => 
    arr.genre.forEach(x => genreSet.add(x))
  );
  return [...genreSet].sort();
};

const App = () => {
  const [ filteredData, setFilteredData ] = useState([]);
  const [ originalData, setOriginalData ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ years, setYears ] = useState([]);
  const [ types, setTypes ] = useState([]);
  const [ genres, setGenres ] = useState([]);
  const [ dropdownOpen, setDropdownOpen ] = useState({
    year: false,
    genre: false,
  });
  const [ filters, setFilters ] = useState({
    year: [],
    genre: [],
    type: [],
    title: "",
  });

  useEffect(() => {
    fetch('https://hubspotwebteam.github.io/CodeExercise/src/js/data/data.json')
    .then(res => res.json())
    .then(json => {
      setYears(getUniqueSet(json.media, 'year'));
      setTypes(getUniqueSet(json.media, 'type'));
      setGenres(getGenreSet(json.media));
      setOriginalData(json.media);
      sortFilteredData(json.media);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setFilteredData(applyFilters());
  }, [filters]);

  const clickOutsideListener = (ref, isOpen) => {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && isOpen && !ref.current.contains(event.target)) {
            setDropdownOpen({
              [ref.current.id]: false,
            })
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [dropdownOpen]);
  };  


  const sortFilteredData = (data) => {
    setFilteredData(data.sort((a, b) => a.title.localeCompare(b.title)));
  };

  const openDropdown = (e, field) => {
    e.preventDefault();
    setDropdownOpen({
      [field]: true,
    })
  };

  const addTypeFilter = (filter) => (
    setFilters({
      ...filters,
      type: [filter],
    }));

  const addFilter = (filter, field) => {
    let newFilters = filters[field];
    let index = filters[field].indexOf(filter);
    if (index >= 0) {
      newFilters.splice(index, 1)
    } else {
      newFilters.push(filter);
    };
    setFilters({
      ...filters,
      [field]: newFilters,
    });
  };

  const search = (term) => {
    const newTerm = term < 3 ? '' : term;
    setFilters({
      ...filters,
      title: newTerm,
    });
  };

  const applyFilters = () => {
    const filterKeys = Object.keys(filters);
    return originalData.filter(item => {
      return filterKeys.every(key => {

        // return all as true if no filter set 
        if (!filters[key].length) return true;
        if (key == 'title') return item[key].toLowerCase().includes(filters[key].toLowerCase());
        if (key == 'genre') return item[key].some(x => filters[key].includes(x));
        
        return filters[key].includes(item[key]);
        
      });
    });
  };

  const resetFilters = (e) => {
    e.preventDefault();
    setFilters({
      year: [],
      genre: [],
      type: [],
      title: "",
    });
  };

  return (
    <div className="filterable-content">
      { loading && 
        <div>
          Loading
        </div>
      }
      { !loading && 
      <>
      <div className="filterable-content__header">
        <div className="filterable-content__filters">
          <Dropdown
            options={years}
            addFilter={addFilter}
            field="year"
            value={filters.year}
            title="Year"
            openDropdown={openDropdown}
            isOpen={dropdownOpen.year}
            filters={filters.year}
            clickListener={clickOutsideListener}
          />
          <Dropdown
            options={genres}
            addFilter={addFilter}
            field="genre"
            value={filters.genre}
            title="Genre"
            openDropdown={openDropdown}
            isOpen={dropdownOpen.genre}
            filters={filters.genre}
            clickListener={clickOutsideListener}
          />

          <div>
          { types.map(x => (
            <label className="radio">
              <input
                type="radio"
                name="type"
                value={x}
                checked={filters.type[0] === x}
                onChange={(e)=> addTypeFilter(e.target.value)}
              />
              {`${x}s`}
            </label>
          ))}
          </div>
        </div>
        <div className="filterable-content__search">
          <div className="search-field">
            <input type="text" value={filters.title} onChange={e=>search(e.target.value)}/>
          </div>
          <button className="button--plain" onClick={(e=>resetFilters(e))}>Clear filters</button>
        </div>       
      </div>
        <ul className="filterable-content__items">
        { !filteredData.length && ( <h2>No results</h2>)}
        { filteredData && filteredData.map((item) => (
          <Tile
            key={item.title}
            content={item}
          />
        ))}
        </ul>
      </>
      }
     
    </div>
  );
};

ReactDom.render(
  <App />,
  document.getElementById('app')
);
