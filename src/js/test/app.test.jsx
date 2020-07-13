import React from "react";
import App from "../components/App";
import { render, act, fireEvent } from "@testing-library/react";
import data from "../data/data.json";

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

  test("shows 'loading' until request has finished", async () => {
    const { queryByTestId } = render(<App />);
    expect(queryByTestId("app-loading")).toBeTruthy();
    await act(fetch);
    expect(queryByTestId("app-loading")).toBeFalsy();
  });

  test("renders error message if fetch fails", async () => {
    fetch.mockImplementationOnce(() => Promise.reject());
    const { queryByTestId } = render(<App />);
    await act(fetch);
    expect(queryByTestId("app-error")).toBeTruthy();
  });
});
