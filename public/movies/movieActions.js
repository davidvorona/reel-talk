import axios from 'axios';

const movieActions = {
  transformQuery: (title) => {
    let query = title;
    query = query.trim().toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
    return query;
  },

  fetchMovie: (title) => {
    const query = movieActions.transformQuery(title);

    axios.get(`/movie/${query}`)
      .then((response) => {
        if (response.data === null) console.log('This movie is not out in theaters.');
        else console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

export default movieActions;
