class MovieModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  render() {
    this.shadowRoot.innerHTML = `
      <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      .movie-modal-bg {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: transparent;
      }
      .movie-modal {
        position: relative;
        top: 10px;
        /*margin: 3rem;*/
        height: 400px;
        width: 700px;
        margin-left: auto;
        margin-right: auto;
        margin-top: calc(50vh - 200px);
        background: #fff;
        opacity: 0;
        padding: 1.3rem 1rem 1rem 1rem;
        border-radius: 1rem;
        transition: opacity .1s ease-out, 
                    top .1s ease-out;
        display: grid;
        grid-template-areas: "img header"
                             "img descr"
                             "movie-year descr"
                             "genres director-starring";
        grid-template-columns: 30% 70%;
        grid-template-rows: 10% 50% 8% 1fr;
        grid-gap: 1rem;
      }
      .movie-modal.animate {
        opacity: 1;
        top: 0;
      }
      .hidden {
        display: none;
      }
      img {
        grid-area: img;
        max-height: 100%;
        max-width: 100%;
        margin: 0 auto;
      }
      .movie-year {
        grid-area: movie-year;
        display: flex;
        justify-content: space-around;
      }
      .year {
        font-weight: 600;
        line-height: 2.5rem;
      }
      .title {
        grid-area: header;
      }
      .director, .starring {
        line-height: 1.7rem;
      }
      .description {
        grid-area: descr;
        margin-top: 1rem;
        line-height: 1.5;
      }
      .genres {
        grid-area: genres;
        word-break: break-all;
      }
      .genres > span {
        margin: .3rem;
        font-size: 1.2rem;
      }
      .short-info {
        grid-area: director-starring;
      }
      .btn-reset {
        display: inline-block;
        border: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        cursor: pointer;
      }
      .fav-btn {
        padding: 1rem;
        background-color: transparent;
        background-position: center;
        background-repeat: no-repeat;
        transition: background 90ms ease-out, 
                    transform 120ms ease;
      }
      .fav-btn[data-is-fav="true"] {
        background-image: url("./components/MovieItem/fav-star.svg");
      }
      .fav-btn[data-is-fav="false"] {
        background-image: url("./components/MovieItem/non-fav-star.svg");
      }
      .close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 1rem;
        background: transparent center no-repeat url("./components/MovieModal/close.svg");
      }
    </style>
    <div class="movie-modal-bg">
      <div class="movie-modal">
        <img alt="Movie poster">
        <div class="movie-year">
          <button class="btn-reset fav-btn"></button>
          <span class="year"></span>
        </div>
        <div class="genres"></div>
        <h2 class="title"></h2>
        <p class="description"></p>
        <div class="short-info">
          <p class="director"></p>
          <p class="starring"></p>
        </div>
        <button class="close btn-reset"></button>    
      </div>
    </div>
    `
  }
  connectedCallback() {
    this.render();
    this.shadowRoot.querySelector('.movie-modal-bg')
      .addEventListener('wheel', this.onWheel);
    this.shadowRoot.querySelector('.close').addEventListener('click', this.onClose);
    this.shadowRoot.querySelector('.fav-btn').addEventListener('click', this.onClickFav);
    PubSub.subscribe(EventType.FAV_MUTATION, this.onFavMutation);
    PubSub.subscribe(EventType.SWITCH_MOVIE_MODAL, this.syncModal);
  }
  disconnectedCallback() {
    this.shadowRoot.querySelector('.movie-modal-bg')
      .removeEventListener('wheel', this.onWheel);
    this.shadowRoot.querySelector('.close').removeEventListener('click', this.onClose);
    this.shadowRoot.querySelector('.fav-btn').removeEventListener('click', this.onClickFav);
  }
  onWheel(event) {
    event.preventDefault();
  }
  onClickFav = () => {
    App.switchFavStatus(App.state.movieModal);
  }
  syncModal = () => {
    if (App.state.movieModal === undefined) {
      this.shadowRoot.querySelector('.movie-modal').classList.remove('animate');
      setTimeout(() => {
        this.shadowRoot.querySelector('.movie-modal-bg').classList.add('hidden');
      }, 150);
    } else {
      this.shadowRoot.querySelector('.movie-modal-bg').classList.remove('hidden');
      setTimeout(() => {
        this.shadowRoot.querySelector('.movie-modal').classList.add('animate');
      }, 10);

      const data = App.state.movieList.find((movie) => movie.id === App.state.movieModal)
      if (data) {
        this.shadowRoot.querySelector('.title').textContent = data.name;
        this.shadowRoot.querySelector('.description').textContent = data.description;
        this.shadowRoot.querySelector('.year').textContent = data.year;
        this.shadowRoot.querySelector('img').setAttribute('src', data.img);
        this.shadowRoot.querySelector('.director').textContent = 'Director: ' + data.director;
        this.shadowRoot.querySelector('.starring').textContent = 'Starring: ' + data.starring.join(', ');
        const genres = this.shadowRoot.querySelector('.genres');
        this.onFavMutation();
        genres.innerHTML = '';
        for (let genre of data.genres) {
          const span = document.createElement('span');
          span.textContent = genre;
          genres.appendChild(span);
        }
      }
    }
  }
  onFavMutation = () => {
    this.shadowRoot.querySelector('.fav-btn').dataset['isFav']
      = App.state.favMovies.includes(App.state.movieModal) ? 'true' : 'false';
  }
  onClose = () => {
    App.setMovieModal();
  }
}
