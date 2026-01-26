export type ICounterReducer = {
  count: number;
  isLoading: boolean;
};

export type IMovie = {
  id: string;
  title: string;
  adult: boolean;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  rating: number;
}

export type IPopularMovies = {
  pageIndex: number;
  movies: IMovie[];
}

export type IMovieReducer = {
  popularMovies: IPopularMovies;
};
