class MovieItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  static get observedAttributes() {
    return ['mid'];
  }
  render() {
    this.shadowRoot.innerHTML = `
      <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      .movie-item {
        background: #e4e4e4;
        height: var(--card-size);
        border-radius: 1rem;
        padding: 1rem;
        border: 1px solid #585858;
        cursor: pointer;
      }
      .movie-item[data-appearance='card'] {
        width: 100%;
        display: grid;
        grid-template-rows: 66% 5rem;
        grid-template-columns: 1fr;
        grid-template-areas: "img" "figcaption";
      }
      .movie-item[data-appearance='list'] {
        display: grid;
        grid-template-columns: 250px 1fr;
        grid-template-rows: 26% 40% 33%;
        grid-template-areas: "img figcaption"
                             "img description"
                             "img genres";
        position: relative;
      }
      .figure {
        position: relative;
        grid-area: img;
        height: 100%;
        margin: 0 auto;
      }
      .figure img {
        max-height: 100%;
        max-width: 95%;
        box-shadow: #d6d6d6 0 1px 0 2px;
      }
      .btn-reset {
        display: inline-block;
        border: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        cursor: pointer;
      }
      .fav-btn, .fav-btn2 {
        position: absolute;
        top: -1rem;
        right: -1rem;
        padding: 1rem;
        background-color: transparent;
        background-position: center;
        background-repeat: no-repeat;
        transition: background 90ms ease-out, 
                    transform 120ms ease;
      }
      .fav-btn2 {
        right: 1rem;
        top: 1rem;
      }
      .fav-btn[data-is-fav="true"],
      .fav-btn2[data-is-fav="true"]{
        background-image: url("./components/MovieItem/fav-star.svg");
      }
      .fav-btn[data-is-fav="false"],
      .fav-btn2[data-is-fav="false"] {
        background-image: url("./components/MovieItem/non-fav-star.svg");
      }
      .movie-item[data-appearance='card'] .figcaption {
        margin-top: .5rem;
        grid-area: figcaption;
      }
      .movie-item[data-appearance='card'] .name, .year {
        text-align: center;
        line-height: 1.5rem;
      }
      .movie-item[data-appearance='card'] .description,
      .movie-item[data-appearance='card'] .genres,
      .movie-item[data-appearance='card'] .fav-btn2,
      .movie-item[data-appearance='list'] .fav-btn {
        display: none;
      }

      .movie-item[data-appearance='list'] figure {
        padding: 0 .5rem;
      }
      .movie-item[data-appearance='list'] .name {
        font-weight: bold;
      }
      .movie-item[data-appearance='list'] .name,
      .movie-item[data-appearance='list'] .year {
        display: inline;
      }
      .movie-item[data-appearance='list'] .year {
        margin-left: 3rem;
      }
      .description {
        grid-area: description;
        line-height: 1.6;
      }
      .genres {
        grid-area: genres;
      }
      .genres > span {
        margin: .3rem;
      }
    </style>
    <div class="movie-item">
      <div class="figure">
        <img alt="Movie poster">
        <button class="btn-reset fav-btn" data-is-fav="false"></button>
      </div>
      <div class="figcaption">
        <p class="name">name</p>
        <p class="year">year</p>
      </div>
      <p class="description"></p>
      <div class="genres"></div>
      <button class="btn-reset fav-btn2" data-is-fav="false"></button>
    </div>
    `
  }
  get id() {
    return parseInt(this.attributes.mid.value);
  }
  connectedCallback() {
    this.render();
    this.shadowRoot.querySelector('.movie-item')
      .addEventListener('click', this.clickListener);
    PubSub.subscribe(EventType.FAV_MUTATION, this.onFavMutation);
    PubSub.subscribe(EventType.SWITCH_VIEW_TYPE, this.onSwitchViewType);
  }
  disconnectedCallback() {
    this.shadowRoot.querySelector('.movie-item')
      .removeEventListener('click', this.clickListener);
  }
  attributeChangedCallback(attrName, oldValue, newValue) {
    if (newValue !== oldValue) {
      switch (attrName) {
        case 'mid': {
          return this.setMovie();
        }
      }
    }
  }
  onFavMutation = () => {
    this.shadowRoot.querySelector('.fav-btn').dataset['isFav']
      = App.state.favMovies.includes(this.id) ? 'true' : 'false';
    this.shadowRoot.querySelector('.fav-btn2').dataset['isFav']
      = App.state.favMovies.includes(this.id) ? 'true' : 'false';
  }
  onSwitchViewType = () => {
    this.shadowRoot.querySelector('.movie-item').dataset.appearance = App.state.viewType;
  }
  setMovie() {
    const data = App.state.movieList.find((movie) => movie.id === this.id)
    if (data) {
      this.shadowRoot.querySelector('.name').textContent = data.name;
      this.shadowRoot.querySelector('.year').textContent = data.year;
      this.shadowRoot.querySelector('.description').textContent = data.description;
      const genres = this.shadowRoot.querySelector('.genres');
      genres.innerHTML = '';
      for (let genre of data.genres) {
        const span = document.createElement('span');
        span.textContent = genre;
        genres.appendChild(span);
      }
      this.shadowRoot.querySelector('img').setAttribute('src', data.img);
    }
    this.onFavMutation();
    this.onSwitchViewType();
  }
  clickListener = (evt) => {
    if (evt.target.classList.contains('fav-btn') || evt.target.classList.contains('fav-btn2')) {
      App.switchFavStatus(this.id);
    } else {
      App.setMovieModal(this.id);
    }
  }
}
