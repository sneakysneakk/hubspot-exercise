import React, { useRef, useState, useEffect } from "react";

const Dropdown = ({ options, addFilter, field, title, filters }) => {
  const dropdownRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const handleClick = (e) => {
    if (dropdownRef.current.contains(e.target)) {
      return;
    }
    setIsOpen(false);
  };

  return (
    <div className="dropdown" id={field} ref={dropdownRef}>
      <button
        data-testid={`app-${field}-button`}
        className="button--arrow"
        id={`${field}-button`}
        onClick={(e) => setIsOpen(!isOpen)}
      >
        {title}
      </button>
      <div
        className={`dropdown__menu ${isOpen ? "dropdown__menu--open" : ""}`}
        data-testid={`app-${field}-menu`}
      >
        <div className="dropdown__scrollarea">
          {options &&
            options.map((option) => (
              <div className="checkbox" key={option}>
                <input
                  id={option}
                  type="checkbox"
                  value={option}
                  checked={filters && filters.includes(option)}
                  onChange={(e) => addFilter(e.target.value, field)}
                  data-testid="app-checkbox"
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
