import React, { useState, useEffect } from "react";
import Tile from "./Tile";
import Dropdown from "./Dropdown";
import Search from "./Search";
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
  const [dropdownOpen, setDropdownOpen] = useState({
    year: false,
    genre: false,
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

  const clickOutsideListener = (ref, isOpen) => {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && isOpen && !ref.current.contains(event.target)) {
          setDropdownOpen({
            [ref.current.id]: false,
          });
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [dropdownOpen]);
  };

  // Alphabetise the results
  const sortFilteredData = (data) => {
    setFilteredData(data.sort((a, b) => a.title.localeCompare(b.title)));
  };

  const openDropdown = (e, field) => {
    e.preventDefault();
    setDropdownOpen({
      [field]: true,
    });
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
                openDropdown={openDropdown}
                isOpen={dropdownOpen.genre}
                filters={filters.genre}
                clickListener={clickOutsideListener}
              />
              <Dropdown
                options={filterOptions.years}
                addFilter={updateCheckboxFilters}
                field="year"
                value={filters.year}
                title="Year"
                openDropdown={openDropdown}
                isOpen={dropdownOpen.year}
                filters={filters.year}
                clickListener={clickOutsideListener}
              />
            </div>

            <div className="filterable-content__search">
              <Search val={filters.title} onSearch={updateFilters} />
            </div>

            <div>
              {filterOptions.types.map((x) => (
                <label className="radio" key={x}>
                  <input
                    type="radio"
                    name="type"
                    value={x}
                    checked={filters.type === x}
                    onChange={(e) => updateFilters(e.target.value, "type")}
                    data-testid={`app-${x}-type`}
                  />
                  {`${x}s`}
                </label>
              ))}
            </div>
            <div className="filterable-content__clear">
              <button
                className="button--plain"
                onClick={(e) => resetFilters(e)}
              >
                Clear filters
              </button>
            </div>
          </nav>
          <section>
            {!filteredData.length && (
              <h3
                className="filterable-content__no-results"
                data-testid="app-no-results"
              >
                No results!! Try again
              </h3>
            )}
            <ul className="filterable-content__items">
              {filteredData &&
                filteredData.map((item) => (
                  <Tile key={item.title} content={item} />
                ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
};

export default App;
