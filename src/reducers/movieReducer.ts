import { IActionState } from '../types/actions';
import { IMovie, IMovieReducer } from '../types/reducers';
import { MOVIES } from './actions';

const initialState: IMovieReducer = {
  popularMovies: {
    pageIndex: 0,
    movies: [] as IMovie[],
  },
};

export const movieReducer = (state = initialState, action: IActionState<any>) => {
  switch (action.type) {
    case MOVIES.GET_LIST_MOVIES:
      const { pageIndex, movies } = action.payload;
      return {
        ...state,
        popularMovies: {
          pageIndex: pageIndex,
          movies: [
            ...state.popularMovies.movies,
            ...movies,
          ],
        },
      };

    default:
      return state;
  }
};
