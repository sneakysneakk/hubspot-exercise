import React, { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import Search from "./Search";
import Types from "./Types";
import Results from "./Results";
import { getUniqueSet, getGenreSet } from "../helpers";

const App = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    years: [],
    types: [],
    genres: [],
  });

  const [filters, setFilters] = useState({
    year: [],
    genre: [],
    type: "",
    title: "",
  });

  useEffect(() => {
    fetch("https://hubspotwebteam.github.io/CodeExercise/src/js/data/data.json")
      .then((res) => res.json())
      .then(({ media }) => {
        setFilterOptions({
          years: getUniqueSet(media, "year"),
          types: getUniqueSet(media, "type"),
          genres: getGenreSet(media),
        });
        setOriginalData(media);
        sortFilteredData(media);
        setLoading(false);
      })
      .catch(() => {
        console.error("Could not load media data");
        setLoading(false);
        setError(true);
      });
  }, []);

  useEffect(() => {
    setFilteredData(applyFilters());
  }, [filters]);

  // Alphabetise the results
  const sortFilteredData = (data) => {
    setFilteredData(data.sort((a, b) => a.title.localeCompare(b.title)));
  };

  const updateFilters = (filter, field) =>
    setFilters({
      ...filters,
      [field]: filter,
    });

  const updateCheckboxFilters = (filter, field) => {
    let newFilters = filters[field];
    let index = filters[field].indexOf(filter);
    if (index >= 0) {
      newFilters.splice(index, 1);
    } else {
      newFilters.push(filter);
    }
    setFilters({
      ...filters,
      [field]: newFilters,
    });
  };

  const applyFilters = () => {
    const filterKeys = Object.keys(filters);
    return originalData.filter((mediaItem) => {
      return filterKeys.every((key) => {
        // return all as true if no filter set
        if (!filters[key].length) return true;

        if (key == "title")
          return mediaItem[key]
            .toLowerCase()
            .includes(filters[key].toLowerCase());
        if (key == "genre")
          return mediaItem[key].some((x) => filters[key].includes(x));
        return filters[key].includes(mediaItem[key]);
      });
    });
  };

  const resetFilters = (e) => {
    e.preventDefault();
    setFilters({
      year: [],
      genre: [],
      type: "",
      title: "",
    });
  };

  return (
    <div className="filterable-content">
      {loading && <div data-testid="app-loading">Loading</div>}
      {error && <div data-testid="app-error">Error!</div>}
      {!loading && !error && (
        <>
          <nav className="filterable-content__header">
            <div className="filterable-content__filters">
              <Dropdown
                options={filterOptions.genres}
                addFilter={updateCheckboxFilters}
                field="genre"
                value={filters.genre}
                title="Genre"
                filters={filters.genre}
              />
              <Dropdown
                options={filterOptions.years}
                addFilter={updateCheckboxFilters}
                field="year"
                value={filters.year}
                title="Year"
                filters={filters.year}
              />
            </div>

            <div className="filterable-content__search">
              <Search val={filters.title} onSearch={updateFilters} />
            </div>

            <Types
              options={filterOptions.types}
              onSelect={updateFilters}
              filters={filters.type}
            />

            <div className="filterable-content__clear">
              <button
                className="button--plain"
                onClick={(e) => resetFilters(e)}
              >
                Clear filters
              </button>
            </div>
          </nav>

          <Results results={filteredData} />
        </>
      )}
    </div>
  );
};

export default App;
