const API_KEY = "f995a8f6-c117-4836-980e-ce9a6631c1cf";
const API_TOP_POPULAR =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";

const API_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

const urlMovie = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";

getMovies(API_TOP_POPULAR);

async function getMovies(url) {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });

  const resData = await res.json();
  showMovies(resData);
}

function getClassByRate(vote) {
  if (vote >= 7) {
    return "green";
  } else if (vote > 5) {
    return "orange";
  } else {
    return "red";
  }
}

function showMovies(data) {
  const moviesEl = document.querySelector(".movies");
  document.querySelector(".movies").innerHTML = "";

  data.films.forEach((movie) => {
    // ! MOVIEel
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
    <div class="movie__cover-inner">
    <img
      src="${movie.posterUrlPreview}"
      class="movie__cover"
      alt="${movie.nameRu}"
    />
    <div class="movie__cover--darkened"></div>
  </div>
  <div class="movie__info">
    <div class="movie__title">${movie.nameRu}</div>
    <div class="movie__category">${movie.genres.map(
      (genre) => ` ${genre.genre}`
    )}</div>
    ${
      movie.rating &&
      `
    <div class="movie__average movie__average--${getClassByRate(
      movie.rating
    )}">${movie.rating}</div>
        `
    }
  </div>
    `;
    movieEl.addEventListener("click", () => openModal(movie.filmId));
    moviesEl.appendChild(movieEl);

    // console.log(movieEl);
  });
}

const form = document.querySelector("form");
const search = document.querySelector(".header__search");

// ! FROM
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const apiSearchUrl = `${API_SEARCH}.${search.value}`;

  if (search.value) {
    getMovies(apiSearchUrl);

    search.value = "";
  }
});

// ! modalEl
const modalEl = document.querySelector(".modal");

async function openModal(id) {
  const res = await fetch(urlMovie + id, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await res.json();

  console.log(id);
  modalEl.classList.add("modal--show");
  document.body.classList.add("stop-scrolling");
  modalEl.innerHTML = `

  <div class="modal__card">
  <img class="modal__movie-backdrop" src="${respData.posterUrl}" alt="">
  <h2>
    <span class="modal__movie-title">${respData.nameRu}</span>
    <span class="modal__movie-release-year"> - ${respData.year}</span>
  </h2>
  <ul class="modal__movie-info">
    <div class="loader"></div>
    <li class="modal__movie-genre">Жанр - ${respData.genres.map(
      (el) => `<span>${el.genre}</span>`
    )}</li>
    ${
      respData.filmLength
        ? `<li class="modal__movie-runtime">Время - ${respData.filmLength} минут</li>`
        : ""
    }
    <li >Сайт: <a class="modal__movie-site" href="${respData.webUrl}">${
    respData.webUrl
  }</a></li>
    <li class="modal__movie-overview">Описание - ${respData.description}</li>
  </ul>
  <button type="button" class="modal__button-close">Закрыть</button>
</div>
  `;
  const btnDel = document.querySelector(".modal__button-close");
  btnDel.addEventListener("click", () => closeModal());
}

function closeModal() {
  modalEl.classList.remove("modal--show");
}

window.addEventListener("click", (e) => {
  if (e.target === modalEl) {
    closeModal();
  }
});

window.addEventListener("keydown", (e) => {
  if (e.keyCode == 27) {
    closeModal();
  }
});
