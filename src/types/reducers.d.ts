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

export type CurrencyMeta = {
  code: string;
  name: string;
  countryCode: string;
};

export type ICurrency = {
  source_currency_code: string;
  source_currency_name: string;
  destination_currency_code: string;
  destination_currency_name: string;
}

export type IConversionHistoryItem = {
  id: number;
  timestamp: number;
  sourceCurrency: string;
  destinationCurrency: string;
  amount: number;
  rate: number;
  convertedAmount: number;
};

export type IConversionReducer = {
  sourceCurrency: string | undefined;
  destinationCurrency: string | undefined;
  amount: number;
  rate: number;
  isLoading: boolean;
  destinationCurrencies: Record<string, CurrencyMeta>;
  conversionHistory: IConversionHistoryItem[];
};
