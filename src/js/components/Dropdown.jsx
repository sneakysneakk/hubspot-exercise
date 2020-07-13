import React, { useRef } from "react";

const Dropdown = ({
  options,
  addFilter,
  field,
  title,
  openDropdown,
  isOpen,
  filters,
  clickListener,
}) => {
  const dropdownRef = useRef(null);
  clickListener(dropdownRef, isOpen);

  return (
    <div className="dropdown" id={field} ref={dropdownRef}>
      <button
        className="button--arrow"
        id={`${field}-button`}
        onClick={(e) => openDropdown(e, field)}
      >
        {title}
      </button>
      <div
        tabIndex="0"
        className={`dropdown__menu ${isOpen ? "dropdown__menu--open" : ""}`}
      >
        <div className="dropdown__scrollarea">
          {options &&
            options.map((option) => (
              <div className="checkbox" key={option}>
                <input
                  type="checkbox"
                  value={option}
                  tabIndex="0"
                  checked={filters && filters.includes(option)}
                  onChange={(e) => addFilter(e.target.value, field)}
                />
                <label htmlFor={option}>{option}</label>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
