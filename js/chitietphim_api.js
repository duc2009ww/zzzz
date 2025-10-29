// ✅ Thay API key TMDB của bạn tại đây
const API_KEY = "7e50ba5ee6342f59a6ce19033647df4f";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

// ======== LẤY PHIM TỪ URL ========
const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");
const movieDetail = document.getElementById("movie-detail");
const trailerDiv = document.getElementById("trailer");
const episodeList = document.getElementById("episodeList");
const episodePlayer = document.getElementById("episodePlayer");
const episodeFrame = document.getElementById("episodeFrame");

// ======== HÀM CHÍNH ========
async function loadMovieDetail(id) {
  try {
    // Gọi API chi tiết phim
    const res = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=vi-VN`
    );
    let movie = await res.json();

    // Nếu không tìm thấy phim chiếu rạp → thử TV Show
    if (movie.success === false) {
      const tvRes = await fetch(
        `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=vi-VN`
      );
      movie = await tvRes.json();
      movie.isTV = true;
    } else {
      movie.isTV = false;
    }

    if (movie.success === false) {
      movieDetail.innerHTML = `<h4 class="text-danger">Không tìm thấy phim!</h4>`;
      return;
    }

    document.title = `Chi tiết phim - ${movie.title || movie.name}`;
    const poster = movie.poster_path
      ? `${IMG_URL}${movie.poster_path}`
      : "https://via.placeholder.com/500x750?text=No+Image";

    movieDetail.innerHTML = `
      <div class="col-md-4 text-center">
        <img src="${poster}" alt="${
      movie.title || movie.name
    }" class="movie-poster shadow">
      </div>
      <div class="col-md-8">
        <div class="movie-info">
          <h2>${movie.title || movie.name}</h2>
          <ul class="list-unstyled">
            <li><strong>Năm:</strong> ${(
              movie.release_date ||
              movie.first_air_date ||
              "N/A"
            ).slice(0, 4)}</li>
            <li><strong>Thể loại:</strong> ${
              movie.genres?.map((g) => g.name).join(", ") || "Không rõ"
            }</li>
            <li><strong>Điểm TMDB:</strong> ⭐ ${
              movie.vote_average?.toFixed(1) || "?"
            }/10</li>
            <li><strong>Trạng thái:</strong> ${movie.status || "Không rõ"}</li>
            <li><strong>Ngôn ngữ:</strong> ${(
              movie.original_language || "N/A"
            ).toUpperCase()}</li>
          </ul>
          <div class="rating mb-3" id="starRating">
            <strong>Đánh giá của bạn:</strong><br>
            <i class="bi bi-star inactive" data-rate="1"></i>
            <i class="bi bi-star inactive" data-rate="2"></i>
            <i class="bi bi-star inactive" data-rate="3"></i>
            <i class="bi bi-star inactive" data-rate="4"></i>
            <i class="bi bi-star inactive" data-rate="5"></i>
            <span id="ratingValue" class="ms-2">(chưa có)</span>
          </div>
          <p>${movie.overview || "Chưa có mô tả cho phim này."}</p>
        </div>
      </div>
    `;

    // Trailer
    const trailerKey = await loadTrailer(id, movie.isTV);
    // Danh sách tập
    loadEpisodes(id, movie.isTV, trailerKey);

    // Các tiện ích
    initRating();
    initComments();
  } catch (err) {
    console.error("Lỗi khi tải phim:", err);
    movieDetail.innerHTML = `<h4 class="text-danger">Lỗi khi tải dữ liệu phim!</h4>`;
  }
}

// ======== TRAILER ========
async function loadTrailer(id, isTV) {
  try {
    const res = await fetch(
      `${BASE_URL}/${
        isTV ? "tv" : "movie"
      }/${id}/videos?api_key=${API_KEY}&language=vi-VN`
    );
    const data = await res.json();
    const videos = data.results || [];
    const trailer = videos.find(
      (v) => v.type === "Trailer" && v.site === "YouTube"
    );

    if (trailer) {
      trailerDiv.innerHTML = `
        <div class="col-12 mt-4">
          <h3>🎞 Trailer</h3>
          <div class="ratio ratio-16x9">
            <iframe src="https://www.youtube.com/embed/${trailer.key}" allowfullscreen></iframe>
          </div>
        </div>
      `;
      return trailer.key;
    }
    return null;
  } catch (err) {
    console.error("Lỗi khi tải trailer:", err);
    return null;
  }
}

// ======== DANH SÁCH TẬP PHIM ========
async function loadEpisodes(id, isTV, trailerKey) {
  episodeList.innerHTML = "";

  if (isTV) {
    // Lấy danh sách tập cho season 1
    try {
      const res = await fetch(
        `${BASE_URL}/tv/${id}/season/1?api_key=${API_KEY}&language=vi-VN`
      );
      const data = await res.json();
      const episodes = data.episodes || [];

      if (episodes.length === 0) {
        episodeList.innerHTML = `<span class="text-muted">Chưa có dữ liệu tập phim.</span>`;
        return;
      }

      episodes.forEach((ep, i) => {
        const btn = document.createElement("button");
        btn.className = "btn btn-outline-dark btn-sm";
        btn.textContent = `Tập ${ep.episode_number}`;
        if (i === 0) btn.classList.add("active");

        btn.addEventListener("click", () => {
          // Cập nhật nút active
          document
            .querySelectorAll("#episodeList button")
            .forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");

          // Cập nhật video (nếu có trailer riêng)
          if (trailerKey) {
            episodeFrame.src = `https://www.youtube.com/embed/${trailerKey}`;
          } else {
            episodeFrame.src = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // video demo nếu không có
          }
          episodePlayer.classList.remove("d-none");
          episodePlayer.scrollIntoView({ behavior: "smooth" });
        });
        episodeList.appendChild(btn);
      });

      // Tự động play tập đầu
      const firstBtn = episodeList.querySelector("button.active");
      if (firstBtn) firstBtn.click();
    } catch (err) {
      console.error("Lỗi khi tải tập phim:", err);
    }
  } else {
    // Phim chiếu rạp => chỉ có 1 tập
    const btn = document.createElement("button");
    btn.className = "btn btn-dark btn-sm active";
    btn.textContent = "Tập 1";

    btn.addEventListener("click", () => {
      episodeFrame.src = trailerKey
        ? `https://www.youtube.com/embed/${trailerKey}`
        : "https://www.youtube.com/embed/dQw4w9WgXcQ";
      episodePlayer.classList.remove("d-none");
      episodePlayer.scrollIntoView({ behavior: "smooth" });
    });

    episodeList.appendChild(btn);
    btn.click(); // auto play
  }
}

// ======== ĐÁNH GIÁ SAO ========
function initRating() {
  const stars = document.querySelectorAll("#starRating i");
  const ratingValue = document.getElementById("ratingValue");
  const ratingKey = `rating_${movieId}`;
  let currentRating = localStorage.getItem(ratingKey) || 0;

  highlightStars(currentRating);

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      const rate = parseInt(star.getAttribute("data-rate"));
      localStorage.setItem(ratingKey, rate);
      highlightStars(rate);
    });
  });

  function highlightStars(rating) {
    stars.forEach((s) => {
      s.classList.remove("bi-star-fill");
      s.classList.add("inactive");
    });
    for (let i = 0; i < rating; i++) {
      stars[i].classList.add("bi-star-fill");
      stars[i].classList.remove("inactive");
    }
    ratingValue.textContent = rating > 0 ? `(${rating}/5 sao)` : "(chưa có)";
  }
}

// ======== BÌNH LUẬN (localStorage) ========
function initComments() {
  const form = document.getElementById("commentForm");
  const text = document.getElementById("commentText");
  const list = document.getElementById("comments");
  const commentKey = `comments_${movieId}`;

  const savedComments = JSON.parse(localStorage.getItem(commentKey)) || [];
  savedComments.forEach((c) => addCommentToList(c));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const comment = text.value.trim();
    if (comment) {
      addCommentToList(comment);
      savedComments.unshift(comment);
      localStorage.setItem(commentKey, JSON.stringify(savedComments));
      text.value = "";
    }
  });

  function addCommentToList(comment) {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = comment;
    list.prepend(li);
  }
}

// ======== KHỞI ĐỘNG ========
if (movieId) {
  loadMovieDetail(movieId);
} else {
  movieDetail.innerHTML = `<h4 class="text-danger">Không có ID phim hợp lệ!</h4>`;
}
