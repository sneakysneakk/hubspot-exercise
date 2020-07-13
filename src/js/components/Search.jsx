import React from "react";

const Search = ({ val = "", onSearch }) => (
  <div className="search-field">
    <input
      type="search"
      placeholder="search..."
      value={val}
      onChange={(e) => onSearch(e.target.value, "title")}
      data-testid="app-search-input"
    />
  </div>
);

export default Search;
