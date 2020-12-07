
class FavList extends HTMLElement {
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
      h2 {
        line-height: 5rem;
      }
      ul {
        list-style-type: none;
      }
      button {
        display: inline-block;
        padding: 4px;
      }
    </style>
    <div>
      <h2>Favorite List</h2>
      <ul id="myul"></ul>
      <template id="me">
        <li>
          <span></span>
          <button class="unfav">X</button>
        </li>
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
  }
  onFavMutation = () => {
    this.shadowRoot.querySelector('#myul').innerHTML = ''

    for (let id of App.state.favMovies) {
      const instance = document.importNode(
        this.shadowRoot.getElementById('me').content, true);
      const data = App.state.movieList.find((mov) => mov.id === id);
      instance.querySelector('span').textContent = data.name;
      instance.querySelector('button').dataset.id = id;
      this.shadowRoot.querySelector('#myul').appendChild(instance);
    }
  }
  onUnfav({target}) {
    App.switchFavStatus(parseInt(target.dataset.id));
  }
}
