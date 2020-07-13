import React from "react";
import Tile from "../components/Tile";
import { render } from "@testing-library/react";

const props = {
  content: {
    poster: "mm",
    title: "1986",
    year: "1986",
    genre: ["horror"],
  },
};

describe("tile", () => {
  test("renders Tile component", () => {
    const { queryByText } = render(<Tile {...props} />);
    expect(queryByText(/1986/i)).toBeTruthy();
  });
});
