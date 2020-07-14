import React, { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import Search from "./Search";
import Types from "./Types";
import Results from "./Results";
import { getFilterOptions, sortAlphabetically } from "../helpers";

const App = () => {
  const defaultFilters = {
    year: [],
    genre: [],
    type: "",
    title: "",
  };
  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);
  const [filterOptions, setFilterOptions] = useState({
    year: [],
    types: [],
    genre: [],
  });

  useEffect(() => {
    fetch("https://hubspotwebteam.github.io/CodeExercise/src/js/data/data.json")
      .then((res) => res.json())
      .then(({ media }) => {
        setFilterOptions(getFilterOptions(media));
        setOriginalData(media);
        setFilteredData(sortAlphabetically(media));
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
    setFilters(defaultFilters);
  };

  return (
    <div className="filterable-content">
      {loading && <div data-testid="app-loading">Loading</div>}
      {error && <div data-testid="app-error">Error!</div>}
      {!loading && !error && (
        <>
          <nav className="filterable-content__header">
            <div className="filterable-content__filters">
              {["genre", "year"].map((option) => (
                <Dropdown
                  key={option}
                  options={filterOptions[option]}
                  addFilter={updateCheckboxFilters}
                  field={option}
                  activeFilters={filters[option]}
                />
              ))}
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
                data-testid="app-clear-filters"
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
