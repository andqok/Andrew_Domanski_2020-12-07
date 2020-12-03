
class FavList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  render() {
    this.shadowRoot.innerHTML = `<div>
      <ul id="myul"></ul>
      <template id="me">
        <li><button>X</button></li>
      </template>
    </div>`
  }
  connectedCallback() {
    this.render();
    this.shadowRoot.addEventListener('click', this.onUnfav);
    PubSub.subscribe(EventType.FAV_MUTATION, this.onFavMutation);
  }
  disconnectedCallback() {
    this.shadowRoot.addEventListener('click', this.onUnfav);
    PubSub.unsubscribe(EventType.FAV_MUTATION, this.onFavMutation);
  }
  onFavMutation = () => {
    this.shadowRoot.querySelector('#myul').innerHTML = ''

    for (let id of App.state.favMovies) {
      const instance = document.importNode(
        this.shadowRoot.getElementById('me').content, true);
      const data = App.state.movieList.find((mov) => mov.id === id);
      instance.firstChild.textContent = data.name
      instance.querySelector('button').dataset.id = id;
      this.shadowRoot.querySelector('#myul').appendChild(instance);
    }
  }
  onUnfav({target}) {
    App.switchFavStatus(parseInt(target.dataset.id));
  }
}
