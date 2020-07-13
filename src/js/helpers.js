export const getUniqueSet = (data, field) =>
  [...new Set(data.map((obj) => obj[field]))].sort();

export const getGenreSet = (data) => {
  const genreSet = new Set();
  data.forEach((arr) => arr.genre.forEach((x) => genreSet.add(x)));
  return [...genreSet].sort();
};
