// js/API.js
const API_KEY = "7e50ba5ee6342f59a6ce19033647df4f";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

// ---- Load Hot Movies ----
async function loadHotMovies() {
  const res = await fetch(
    `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=vi-VN`
  );
  const data = await res.json();
  const movies = data.results.slice(0, 6);
  const hotContainer = document.getElementById("hotMovies");

  hotContainer.innerHTML = movies
    .map(
      (m, i) => `
      <div class="carousel-item ${i === 0 ? "active" : ""}">
        <img src="${IMG_URL + m.backdrop_path}" class="d-block w-100" alt="${
        m.title
      }">
        <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-2">
          <h5>${m.title}</h5>
        </div>
      </div>`
    )
    .join("");
}

// ---- Load Movies by Genre ----
// Lấy ID thể loại từ TMDB
const GENRES = {
  action: 28, // Hành động
  anime: 16, // Hoạt hình / Anime
};

// Hàm load phim theo thể loại
async function loadMoviesByGenre(genreId, containerId) {
  const res = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&language=vi-VN&page=1`
  );
  const data = await res.json();
  const movies = data.results.slice(0, 10);
  const container = document.getElementById(containerId);

  container.innerHTML = movies
    .map(
      (m) => `
      <div class="col">
        <div class="card shadow-sm h-100">
          <img src="${
            m.poster_path
              ? IMG_URL + m.poster_path
              : "https://via.placeholder.com/500x750?text=No+Image"
          }"
               class="card-img-top" alt="${m.title}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${m.title}</h5>
            <p class="text-muted mb-2"><small>${
              m.release_date ? m.release_date.slice(0, 4) : "N/A"
            }</small></p>
            <div class="mt-auto">
              <a href="./pages/chitietphim.html?id=${
                m.id
              }" class="btn btn-sm btn-dark">Xem chi tiết</a>
            </div>
          </div>
        </div>
      </div>`
    )
    .join("");
}

// ---- Gọi tất cả khi load trang ----
document.addEventListener("DOMContentLoaded", () => {
  loadHotMovies();
  loadMoviesByGenre(GENRES.action, "actionMovies");
  loadMoviesByGenre(GENRES.anime, "animeMovies");
});
