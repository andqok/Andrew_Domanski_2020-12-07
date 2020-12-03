class MovieListControls extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  render() {
    this.shadowRoot.innerHTML = `<div>
      <select id="myselect">
      
      </select>
    </div>`
  }
  connectedCallback() {
    this.render();
    this.shadowRoot.getElementById('myselect')
      .addEventListener('change', this.onSelectChanged);
    PubSub.subscribe(EventType.GENRES_MUTATION, this.onGenresMutation);
  }
  disconnectedCallback() {
    this.shadowRoot.getElementById('myselect')
      .removeEventListener('change', this.onSelectChanged);
    PubSub.unsubscribe(EventType.GENRES_MUTATION, this.onGenresMutation);
  }
  onGenresMutation = () => {
    this.shadowRoot.querySelector('#myselect').innerHTML = ''

    for (let genre of App.state.genres) {
      const instance = document.createElement('option');
      instance.value = genre;
      instance.textContent = genre;
      this.shadowRoot.querySelector('#myselect').appendChild(instance);
    }
  }
  onSelectChanged = (event) => {
    App.setActiveGenre(event.target.value)
  }
}
