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
      figure {
          width: 200px;
          height: 200px;
      }
      img {
          height: 100%;
      }
    </style>
    <div class="movie-item">
      <figure>
        <img alt="Movie poster">
        <button id="fav">Fav</button>
      </figure>
      <figcaption>
        <span class="name">name</span>
        <span class="year">year</span>
      </figcaption>
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
    PubSub.subscribe(EventType.SELECT_GENRE, this.onGenreSelected)
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
    this.shadowRoot.querySelector('#fav').textContent
      = App.state.favMovies.includes(this.id) ? 'Unfav' : 'Fav'
  }
  onGenreSelected = () => {
    const data = App.state.movieList.find((mov) => mov.id === this.id);
    if (data.genres.includes(App.state.selectedGenre)) {
      this.shadowRoot.querySelector('.movie-item').style.display = 'block'
    } else {
      this.shadowRoot.querySelector('.movie-item').style.display = 'none'
    }
  }
  setMovie() {
    const data = App.state.movieList.find((movie) => movie.id === this.id)
    if (data) {
      this.shadowRoot.querySelector('.name').textContent = data.name;
      this.shadowRoot.querySelector('.year').textContent = data.year;
      this.shadowRoot.querySelector('img').setAttribute('src', data.img);
    }
    this.onFavMutation();
  }
  clickListener = (evt) => {
    if (evt.target.id === 'fav') {
      App.switchFavStatus(this.id);
    }
  }
}
