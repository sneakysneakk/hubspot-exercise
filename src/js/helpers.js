const getUniqueSet = (data, field) =>
  [...new Set(data.map((obj) => obj[field]))].sort();

const getGenreSet = (data) => {
  const genreSet = new Set();
  data.forEach((arr) => arr.genre.forEach((x) => genreSet.add(x)));
  return [...genreSet].sort();
};

export const getFilterOptions = (media) => ({
  year: getUniqueSet(media, "year"),
  types: getUniqueSet(media, "type"),
  genre: getGenreSet(media),
});

export const sortAlphabetically = (data) =>
  data.sort((a, b) => a.title.localeCompare(b.title));
