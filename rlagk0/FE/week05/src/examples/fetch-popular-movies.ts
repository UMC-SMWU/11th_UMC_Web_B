import { getMoviesWithFetch } from "../api/movies/get-movies-with-fetch";

// 4.2 실습용: 인기 영화 1페이지를 요청하고 결과를 Console에 출력해요.
getMoviesWithFetch(1)
  .then((response) => {
    console.log("인기 영화 응답:", response);
    console.log(
      "첫 번째 영화:",
      response.results[0]?.title,
      "/ 전체 페이지:",
      response.total_pages,
    );
  })
  .catch((error) => console.error(error));
