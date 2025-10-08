const API_KEY = '';
const BASE_URL = '';
async function getPopularMovies() {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=vi-VN&page=1`);
    const data = await response.json();
    console.log(data.results); // Danh sách phim
    return data.results;
  }
