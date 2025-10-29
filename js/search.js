// ✅ Thay YOUR_API_KEY bằng API key TMDB của bạn
const API_KEY = "7e50ba5ee6342f59a6ce19033647df4f";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

// Lấy tham số từ URL (từ search.html?q=...)
const params = new URLSearchParams(window.location.search);
const keyword = (params.get("q") || "").trim();
const resultDiv = document.getElementById("result");
const noResultDiv = document.getElementById("noResult");

// Hàm hiển thị phim ra giao diện
function renderMovies(list) {
  resultDiv.innerHTML = "";
  if (!list || list.length === 0) {
    noResultDiv.style.display = "block";
    return;
  }
  noResultDiv.style.display = "none";

  list.forEach((movie) => {
    const poster = movie.poster_path
      ? `${IMG_URL}${movie.poster_path}`
      : "https://via.placeholder.com/500x750?text=No+Image";

    resultDiv.innerHTML += `
      <div class="col-sm-6 col-md-4 col-lg-3">
        <div class="card movie-card shadow-sm">
          <img src="${poster}" class="card-img-top" alt="${movie.title}">
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text text-muted mb-2">
              <small>${
                movie.release_date ? movie.release_date.slice(0, 4) : "N/A"
              }</small>
            </p>
            <a href="chitietphim.html?id=${
              movie.id
            }" class="btn btn-sm btn-dark">Xem chi tiết</a>
          </div>
        </div>
      </div>`;
  });
}

// Hàm gọi API TMDB để tìm kiếm phim
async function searchMoviesFromTMDB(query) {
  try {
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=vi-VN&query=${encodeURIComponent(
        query
      )}`
    );
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("Lỗi khi gọi API TMDB:", err);
    return [];
  }
}

// Khi người dùng vào trang có query
if (keyword) {
  document.getElementById("searchInput").value = keyword;
  searchMoviesFromTMDB(keyword).then(renderMovies);
}

// Xử lý form tìm kiếm
document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = document.getElementById("searchInput").value.trim();
  if (q) window.location.href = `search.html?q=${encodeURIComponent(q)}`;
});
