import React from "react";
import Dropdown from "../components/Dropdown";
import { render } from "@testing-library/react";

const props = {
  option: [],
  addFilter: jest.fn(),
  field: "year",
  title: "Year",
  openDropdown: jest.fn(),
  isOpen: false,
  filters: [],
  clickListener: jest.fn(),
};

describe("Dropdown", () => {
  test("renders Dropdown component", () => {
    const { queryByText } = render(<Dropdown {...props} />);
    expect(queryByText(/year/i)).toBeTruthy();
  });
});
