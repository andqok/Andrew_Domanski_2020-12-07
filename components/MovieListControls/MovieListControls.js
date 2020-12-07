class MovieListControls extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .movie-list-controls {
          display: flex;
          justify-content: space-between;
          padding: 1rem;
        }
        button {
          display: inline-block;
          border: none;
          padding: 1rem;
          background-color: transparent;
          background-position: center;
          background-repeat: no-repeat;
          cursor: pointer;
          transition: background 90ms ease-out, 
                      transform 120ms ease;
          -webkit-appearance: none;
          -moz-appearance: none;
          float: right;
          filter:contrast(.5);
        }
        button[disabled] {
          filter:none;
          cursor: default;
        }
        select {
          padding: .5rem;
        }
        .select-wrapper {
          flex-grow: 1;
        }
        .show-cards {
          background-image: url("./components/MovieListControls/grid.svg");
          margin-right: 1rem;
        }
        .show-list {
          background-image: url("./components/MovieListControls/list.svg");
        }
        </style>
      <div class="movie-list-controls">
        <div class="select-wrapper">
        <select id="genre-select">
          <option value="" selected disabled hidden>select genre</option>
        </select>
        </div>
        
        <button class="show-cards"></button>
        <button class="show-list"></button>
      </div>`
  }
  connectedCallback() {
    this.render();
    this.shadowRoot.getElementById('genre-select')
      .addEventListener('change', this.onSelectChanged);
    this.shadowRoot.querySelector('.show-cards').addEventListener('click', this.onShowCards);
    this.shadowRoot.querySelector('.show-list').addEventListener('click', this.onShowList);
    PubSub.subscribe(EventType.SET_GENRE_LIST, this.onGenresMutation);
    PubSub.subscribe(EventType.SWITCH_VIEW_TYPE, this.onSwitchViewType);
  }
  disconnectedCallback() {
    this.shadowRoot.getElementById('genre-select')
      .removeEventListener('change', this.onSelectChanged);
    this.shadowRoot.querySelector('.show-cards').removeEventListener('click', this.onShowCards);
    this.shadowRoot.querySelector('.show-list').removeEventListener('click', this.onShowList);
  }
  onGenresMutation = () => {
    removeBySelector(this.shadowRoot, 'option:enabled')
    for (let genre of App.state.genres) {
      const instance = document.createElement('option');
      instance.value = genre;
      instance.textContent = genre;
      this.shadowRoot.querySelector('#genre-select').appendChild(instance);
    }
  }
  onSwitchViewType = () => {
    this.shadowRoot.querySelector('.show-cards').disabled
      = App.state.viewType === ViewType.CARD ? 'true' : '';
    this.shadowRoot.querySelector('.show-list').disabled
      = App.state.viewType === ViewType.LIST ? 'true' : '';
  }
  onShowCards = () => {
    if (App.state.viewType === ViewType.LIST) {
      App.setViewType(ViewType.CARD);
    }
  }
  onShowList = () => {
    if (App.state.viewType === ViewType.CARD) {
      App.setViewType(ViewType.LIST);
    }
  }
  onSelectChanged = (event) => {
    App.setActiveGenre(event.target.value)
  }
}
