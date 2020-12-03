const EventType = {
  FAV_MUTATION: 'FAV_MUTATION',
  GENRES_MUTATION: 'GENRES_MUTATION',
  SELECT_GENRE: 'SELECT_GENRE'
}
const ViewType = {
  CARD: 'card',
  LIST: 'list',
}

function getApp() {
  let movieList = [],
      favMovies = [],
      genres = [],
      viewType = ViewType.CARD,
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
        const movie = document.createElement('movie-item')
        el('#movie-item-container').appendChild(movie);
        movie.setAttribute('mid', movieData.id);
        movie.setAttribute('appearance', viewType);

        movieData.genres.forEach((newGenre) => {
          const existingGenre = genres.find((oldGenre) => {
            return oldGenre.toLowerCase() === newGenre.toLowerCase()
          })
          if (!existingGenre) genres.push(newGenre);
        });
      }
      PubSub.publish(EventType.GENRES_MUTATION)
      PubSub.publish(EventType.FAV_MUTATION);
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
    setMovieModal(id) {
      movieModal = id;
    },
    setActiveGenre(genre) {
      selectedGenre = genre;
      PubSub.publish(EventType.SELECT_GENRE);
    }
  }
}
