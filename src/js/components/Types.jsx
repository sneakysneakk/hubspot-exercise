import React from "react";

const Types = ({ options, onSelect, filters }) => (
  <div>
    {options.map((x) => (
      <label className="radio" key={x}>
        <input
          type="radio"
          name="type"
          value={x}
          checked={filters === x}
          onChange={(e) => onSelect(e.target.value, "type")}
          data-testid={`app-${x}-type`}
        />
        {`${x}s`}
      </label>
    ))}
  </div>
);

export default Types;
