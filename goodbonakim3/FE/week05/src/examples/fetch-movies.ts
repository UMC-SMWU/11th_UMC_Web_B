import { getMovieWithFetch } from "../api/movies/get-movies-with-fetch";

getMovieWithFetch(1)
  .then((response) => console.log(response.results))
  .catch((error) => console.error(error));
