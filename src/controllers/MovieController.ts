import { MOVIES } from '../reducers/actions';
import CommonReduxStore from '../store/commonStore';
import { fetchPopularMovies } from './apis/movie';

export interface IMovieController {
  getPopularMovies: (page: number) => void;
}

const MovieController: IMovieController = {
  getPopularMovies: async (page) => {
    const response = await fetchPopularMovies(page);

    if (response.results.length === 0) {
      return;
    }

    CommonReduxStore.getInstance().dispatch({
      type: MOVIES.GET_LIST_MOVIES,
      payload: {
        pageIndex: response.page,
        movies: response.results,
      },
    });
  },
};

export default MovieController;
