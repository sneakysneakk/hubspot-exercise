import React from "react";
import App from "../components/App";
import { render, act, fireEvent } from "@testing-library/react";
import data from "../data/data.json";
import "@testing-library/jest-dom";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(data),
  })
);

describe("App", () => {
  test("renders App component with 30 tiles", async () => {
    const { getAllByTestId } = render(<App />);

    await act(fetch);
    expect(getAllByTestId("app-tile")).toHaveLength(30);
  });

  test("filters tiles when year is selected", async () => {
    const { getAllByTestId, queryByText } = render(<App />);

    await act(fetch);
    fireEvent.click(queryByText("1987"));
    expect(getAllByTestId("app-tile")).toHaveLength(2);
  });

  test("filters tiles when genre is selected", async () => {
    const { getAllByTestId, queryByText } = render(<App />);
    await act(fetch);
    fireEvent.click(queryByText("action"));
    expect(getAllByTestId("app-tile")).toHaveLength(8);
  });

  test("filters tiles when 'books' type is selected", async () => {
    const { getAllByTestId, queryByTestId } = render(<App />);
    await act(fetch);
    fireEvent.click(queryByTestId("app-book-type"));
    expect(getAllByTestId("app-tile")).toHaveLength(15);
  });

  test("filters tiles when 'movie' type is selected", async () => {
    const { getAllByTestId, queryByTestId } = render(<App />);
    await act(fetch);
    fireEvent.click(queryByTestId("app-movie-type"));
    expect(getAllByTestId("app-tile")).toHaveLength(15);
  });

  test("filters tiles when search term is entered", async () => {
    const { getAllByTestId, queryByTestId } = render(<App />);
    await act(fetch);
    fireEvent.change(queryByTestId("app-search-input"), {
      target: { value: "cop" },
    });
    expect(getAllByTestId("app-tile")).toHaveLength(2);
  });

  test("filters tiles when multiple filters are applied", async () => {
    const { getAllByTestId, queryByTestId, queryByText } = render(<App />);
    await act(fetch);
    fireEvent.click(queryByText("action"));
    fireEvent.click(queryByTestId("app-movie-type"));
    fireEvent.click(queryByText("1987"));
    fireEvent.change(queryByTestId("app-search-input"), {
      target: { value: "robo" },
    });
    expect(getAllByTestId("app-tile")).toHaveLength(1);
  });

  test("shows message when no results", async () => {
    const { queryByTestId, queryByText } = render(<App />);
    await act(fetch);
    fireEvent.click(queryByText("action"));
    fireEvent.click(queryByTestId("app-book-type"));
    expect(queryByTestId("app-tile")).toBeFalsy();
    expect(queryByTestId("app-no-results")).toBeTruthy();
  });

  test("returns to original list when 'clear' button is clicked", async () => {
    const { queryByTestId, queryByText, getAllByTestId } = render(<App />);
    await act(fetch);
    fireEvent.click(queryByText("action"));
    fireEvent.click(queryByTestId("app-book-type"));
    expect(queryByTestId("app-tile")).toBeFalsy();

    fireEvent.click(queryByTestId("app-clear-filters"));

    expect(getAllByTestId("app-tile")).toHaveLength(30);
  });

  test("shows 'loading' until request has finished", async () => {
    const { queryByTestId } = render(<App />);
    expect(queryByTestId("app-loading")).toBeTruthy();
    await act(fetch);
    expect(queryByTestId("app-loading")).toBeFalsy();
  });

  test("opens menu when button is clicked", async () => {
    const { queryByTestId } = render(<App />);
    await act(fetch);

    expect(queryByTestId("app-year-menu")).not.toHaveClass(
      "dropdown__menu--open"
    );
    fireEvent.click(queryByTestId("app-year-button"));
    expect(queryByTestId("app-year-menu")).toHaveClass("dropdown__menu--open");
  });

  test("renders error message if fetch fails", async () => {
    fetch.mockImplementationOnce(() => Promise.reject());
    const { queryByTestId } = render(<App />);
    await act(fetch);
    expect(queryByTestId("app-error")).toBeTruthy();
  });

  test("renders the grid items alphabetically", async () => {
    let mediaObject = {
      year: "2001",
      genre: [],
      type: "movie",
    };
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            media: [
              {
                ...mediaObject,
                title: "Zebra",
              },
              {
                ...mediaObject,
                title: "Ant",
              },
              {
                ...mediaObject,
                title: "Cat",
              },
            ],
          }),
      })
    );

    const { getAllByTestId } = render(<App />);
    await act(fetch);

    const tiles = getAllByTestId("app-tile");
    expect(tiles[0]).toHaveTextContent("Ant");
    expect(tiles[1]).toHaveTextContent("Cat");
    expect(tiles[2]).toHaveTextContent("Zebra");
  });
});
