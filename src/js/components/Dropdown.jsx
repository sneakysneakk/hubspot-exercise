import React, { useState } from 'react';

const Dropdown = ({
  options,
  addFilter,
  field,
  title,
  openDropdown,
  isOpen,
  filters,
  }) =>  { 
  return (
    <div className="dropdown">
    <button
      className="button--arrow"
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
