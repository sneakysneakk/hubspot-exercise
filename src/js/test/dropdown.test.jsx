import React from "react";
import Dropdown from "../components/Dropdown";
import { render } from "@testing-library/react";

const props = {
  options: ["one", "happy", "little", "cat"],
  addFilter: jest.fn(),
  field: "test",
  activeFilters: [],
};

describe("Dropdown", () => {
  test("renders Dropdown component", () => {
    const { queryByTestId } = render(<Dropdown {...props} />);
    expect(queryByTestId("app-test-menu")).toBeTruthy();
  });
  test("renders 4 checkboxes", () => {
    const { getAllByTestId } = render(<Dropdown {...props} />);
    expect(getAllByTestId("app-checkbox")).toHaveLength(4);
  });
});
