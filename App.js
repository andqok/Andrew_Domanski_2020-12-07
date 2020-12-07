const EventType = {
  FAV_MUTATION: 'FAV_MUTATION',
  SET_GENRE_LIST: 'SET_GENRE_LIST',
  SELECT_GENRE: 'SELECT_GENRE',
  SWITCH_MOVIE_MODAL: 'SWITCH_MOVIE_MODAL',
  SWITCH_VIEW_TYPE: 'SWITCH_VIEW_TYPE',
};

const ViewType = {
  CARD: 'card',
  LIST: 'list',
};

function getApp() {
  let movieList = [],
      favMovies = [],
      genres = [],
      viewType = ViewType.LIST,
      movieModal,
      selectedGenre;
  try {
    favMovies = JSON.parse(localStorage.getItem('favMovies')).map(i => parseInt(i));
  } catch (error) {
    // fallback above
  }
  window.addEventListener("unload", function() {
    localStorage.setItem('favMovies', JSON.stringify(
      Array.from(new Set(favMovies))
    ));
  });
  const el = (selector) => document.querySelector(selector);

  return {
    get state() {
      return Object.freeze({
        movieList,
        favMovies,
        selectedGenre,
        movieModal,
        genres,
        viewType,
      });
    },
    setMovieList(newMovieList) {
      movieList = newMovieList;
      for (let movieData of movieList) {
        const movie = document.createElement('movie-item');
        el('#movie-item-container').appendChild(movie);
        movie.setAttribute('mid', movieData.id);

        movieData.genres.forEach((newGenre) => {
          const existingGenre = genres.find((oldGenre) => {
            return oldGenre.toLowerCase() === newGenre.toLowerCase();
          })
          if (!existingGenre) genres.push(newGenre);
        });
      }
      PubSub.publish(EventType.SET_GENRE_LIST);
      PubSub.publish(EventType.FAV_MUTATION);
      PubSub.publish(EventType.SWITCH_VIEW_TYPE);
      PubSub.publish(EventType.SWITCH_MOVIE_MODAL);
      App.setViewType(ViewType.CARD);
    },
    switchFavStatus(id) {
      if (id && !Number.isNaN(id)) {
        if (favMovies.includes(id)) {
          favMovies = favMovies.filter(mov => mov !== id);
        } else {
          favMovies.push(id);
        }
        PubSub.publish(EventType.FAV_MUTATION);
      }
    },
    /** Undefined will close modal
     * @param {number?} id */
    setMovieModal(id) {
      movieModal = id;
      PubSub.publish(EventType.SWITCH_MOVIE_MODAL);
    },
    /** @param {ViewType} type */
    setViewType(type) {
      viewType = type;
      el('#movie-item-container').dataset.appearance = type;
      PubSub.publish(EventType.SWITCH_VIEW_TYPE);
    },
    setActiveGenre(genre) {
      selectedGenre = genre;
      const thisGenreMovies = movieList.filter((movie) => {
        return movie.genres.map(i => i.toLowerCase()).includes(selectedGenre.toLowerCase());
      }).map(movie => movie.id);
      const alreadyCreated = [];
      for (let movieNode of (document.querySelectorAll('movie-item') || [])) {
        const id = parseInt(movieNode.getAttribute('mid'))
        if (thisGenreMovies.includes(id)) {
          alreadyCreated.push(id);
        } else {
          movieNode.remove();
        }
      }

      for (let movID of thisGenreMovies) {
        if (!alreadyCreated.includes(movID)) {
          const movie = document.createElement('movie-item');
          el('#movie-item-container').appendChild(movie);
          movie.setAttribute('mid', movID);
        }
      }
    }
  }
}
