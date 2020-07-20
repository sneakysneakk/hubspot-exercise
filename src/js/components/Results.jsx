import React from "react";
import Tile from "./Tile";

const Results = ({ results }) => (
  <section>
    {!results.length && (
      <h3
        className="filterable-content__no-results"
        data-testid="app-no-results"
      >
        No results!! Try again
      </h3>
    )}
    <ul className="filterable-content__items">
      {results.map((item) => (
        <Tile key={item.title} content={item} />
      ))}
    </ul>
  </section>
);

export default Results;
