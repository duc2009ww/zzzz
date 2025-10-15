// js/API.js
const API_KEY = "7e50ba5ee6342f59a6ce19033647df4f"; // 🔑 thay bằng API key thật của bạn
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

/* =====================================================
   🟢 1. GỌI DANH SÁCH PHIM PHỔ BIẾN
   ===================================================== */
async function getPopularMovies(page = 1) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=vi-VN&page=${page}`
    );
    const data = await response.json();
    createMovieCards(data.results);
  } catch (err) {
    console.error("Lỗi khi tải phim phổ biến:", err);
  }
}

/* =====================================================
   🔍 2. TÌM KIẾM PHIM
   ===================================================== */
async function searchMovies(query, page = 1) {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=vi-VN&query=${encodeURIComponent(
        query
      )}&page=${page}`
    );
    const data = await response.json();
    createMovieCards(data.results);
  } catch (err) {
    console.error("Lỗi khi tìm kiếm phim:", err);
  }
}

/* =====================================================
   🎬 3. LẤY CHI TIẾT 1 PHIM
   ===================================================== */
async function getMovieDetails(movieId) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=vi-VN`
    );
    const data = await response.json();
    renderMovieDetail(data);
  } catch (err) {
    console.error("Lỗi khi tải chi tiết phim:", err);
  }
}

/* =====================================================
   🧱 HÀM TẠO NÚT / THẺ PHIM (CARD)
   ===================================================== */
function createMovieCards(movies) {
  const container = document.getElementById("movieList");
  if (!container) return;

  container.innerHTML = "";
  if (movies.length === 0) {
    container.innerHTML = `<p class="text-center text-danger">Không tìm thấy phim nào.</p>`;
    return;
  }

  movies.forEach((movie) => {
    const card = document.createElement("div");
    card.className = "col";

    card.innerHTML = `
      <div class="card shadow-sm">
        <img src="${
          movie.poster_path
            ? IMG_URL + movie.poster_path
            : "https://via.placeholder.com/500x750?text=No+Image"
        }" class="card-img-top" alt="${movie.title}">
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text"><strong>⭐ ${movie.vote_average.toFixed(
            1
          )}</strong> | ${movie.release_date || "N/A"}</p>
          <a href="./pages/chitietphim.html?id=${
            movie.id
          }" class="btn btn-sm btn-dark">Chi tiết</a>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// ======== TRAILER (GỌI API /videos) ========
async function renderTrailer(movieId) {
  const trailerDiv = document.getElementById("trailer");

  try {
    const res = await fetch(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=vi-VN`
    );
    const data = await res.json();
    const videos = data.results;

    if (videos.length > 0) {
      // Lấy trailer đầu tiên trên YouTube
      const trailer = videos.find(v => v.site === "YouTube") || videos[0];
      const youtubeKey = trailer.key;

      trailerDiv.innerHTML = `
        <div class="col-12 mt-4">
          <h3>🎞 Trailer chính thức</h3>
          <div class="ratio ratio-16x9">
            <iframe src="https://www.youtube.com/embed/${youtubeKey}"
                    allowfullscreen></iframe>
          </div>
        </div>
      `;
    } else {
      trailerDiv.innerHTML = `
        <div class="col-12 mt-4">
          <h3>🎞 Trailer</h3>
          <p>Chưa có trailer cho phim này.</p>
        </div>
      `;
    }
  } catch (error) {
    console.error("Lỗi khi tải trailer:", error);
    trailerDiv.innerHTML = `<p class="text-danger">Không thể tải trailer.</p>`;
  }
}


/* =====================================================
   🎞️ 4. HIỂN THỊ CHI TIẾT PHIM + DANH SÁCH TẬP
   ===================================================== */
function renderMovieDetail(movie) {
  const movieDetail = document.getElementById("movie-detail");
  const trailerDiv = document.getElementById("trailer");

  if (!movieDetail) return;

  document.title = `Chi tiết phim - ${movie.title}`;
  movieDetail.innerHTML = `
    <div class="col-md-4 text-center">
      <img src="${
        movie.poster_path
          ? IMG_URL + movie.poster_path
          : "https://via.placeholder.com/400x600?text=No+Image"
      }" alt="${movie.title}" class="movie-poster shadow">
    </div>
    <div class="col-md-8">
      <div class="movie-info">
        <h2>${movie.title}</h2>
        <p><strong>Ngày phát hành:</strong> ${
          movie.release_date || "Chưa cập nhật"
        }</p>
        <p><strong>Điểm đánh giá:</strong> ⭐ ${movie.vote_average.toFixed(
          1
        )}</p>
        <p><strong>Tóm tắt:</strong> ${movie.overview || "Không có mô tả."}</p>
        <a href="https://www.themoviedb.org/movie/${
          movie.id
        }" target="_blank" class="btn btn-dark">Xem trên TMDB</a>
      </div>
    </div>
  `;

  // Trailer
  if (trailerDiv) {
    renderTrailer(movie.id)
  }

  // (Giả lập danh sách tập phim để demo)
  const fakeEpisodes = [
    { ep: 1, url: "https://www.youtube.com/embed/VQGCKyvzIM4" },
    { ep: 2, url: "https://www.youtube.com/embed/TKyJ7ZbRHEA" },
    { ep: 3, url: "https://www.youtube.com/embed/UHd7xXK3FvA" },
  ];
  createEpisodeButtons(fakeEpisodes);
}

/* =====================================================
   📺 5. HÀM TẠO NÚT TẬP PHIM
   ===================================================== */
function createEpisodeButtons(episodes) {
  const episodeList = document.getElementById("episodeList");
  const episodePlayer = document.getElementById("episodePlayer");
  const episodeFrame = document.getElementById("episodeFrame");

  if (!episodeList) return;
  episodeList.innerHTML = "";

  episodes.forEach((ep) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-dark btn-sm";
    btn.textContent = `Tập ${ep.ep}`;
    btn.addEventListener("click", () => {
      episodeFrame.src = ep.url;
      episodePlayer.classList.remove("d-none");
      episodePlayer.scrollIntoView({ behavior: "smooth" });
    });
    episodeList.appendChild(btn);
  });
}

/* =====================================================
   🚀 6. TỰ ĐỘNG GỌI HÀM NẾU TRANG PHÙ HỢP
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.endsWith("index.html") || path === "/") {
    getPopularMovies();
  }

  if (path.includes("search.html")) {
    const query = new URLSearchParams(window.location.search).get("q");
    if (query) searchMovies(query);
  }

  if (path.includes("chitietphim.html")) {
    const movieId = new URLSearchParams(window.location.search).get("id");
    if (movieId) getMovieDetails(11);
  }
});
