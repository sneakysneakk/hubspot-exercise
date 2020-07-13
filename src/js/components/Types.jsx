import React from "react";

const Types = ({ options, onSelect, filters }) => (
  <div>
    {options.map((option) => (
      <label className="radio" key={option}>
        <input
          type="radio"
          name="type"
          value={option}
          checked={filters === option}
          onChange={(e) => onSelect(e.target.value, "type")}
          data-testid={`app-${option}-type`}
        />
        {`${option}s`}
      </label>
    ))}
  </div>
);

export default Types;
