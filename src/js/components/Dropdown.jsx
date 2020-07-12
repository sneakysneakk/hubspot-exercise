import React, { useRef, useState, useEffect } from 'react';

const Dropdown = ({
  options,
  addFilter,
  field,
  title,
  openDropdown,
  isOpen,
  filters,
  clickListener,
  }) =>  { 

  const dropdownRef = useRef(null);
  clickListener(dropdownRef, isOpen);

  return (
    <div className="dropdown" id={field} ref={dropdownRef}>
    <button
      className="button--arrow"
      id={`${field}-button`}
      onClick={e=> openDropdown(e, field)} >
      {title}
    </button>
    <div className={`dropdown__menu ${ isOpen ? 'dropdown__menu--open' : ''}`}>
      { options && options.map(option => (
      <div
        className="checkbox"
        key={option} >
          <input
            id={option}
            type="checkbox"
            value={option}
            checked={filters && filters.includes(option)}
            onChange={e => addFilter(e.target.value, field)}
          />
          <label htmlFor={option}>
            {option}
          </label>
      </div>
      ))}
    </div>
  </div>
)};


export default Dropdown;
