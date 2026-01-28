import React, { useCallback, useMemo } from 'react';
import { View, Button, Text } from 'react-native';
import {  useSelector } from 'react-redux';
import { ICombinedAppState } from '../../store';
import MovieController from '../../controllers/MovieController';
import styles from './styles';
import { FlashList } from '@shopify/flash-list';
import { IMovie } from '../../types/reducers';
import { useAppContext } from '../../context/appContext';

const Movies: React.FC = () => {
  const { colors, toggleTheme } = useAppContext();
  const { popularMovies } = useSelector((selector: ICombinedAppState) => selector.movieReducer);
  const { pageIndex, movies } = popularMovies;

  const style = styles(colors);

  const getMovies = useCallback(() => {
    MovieController.getPopularMovies(pageIndex + 1);
  }, [pageIndex]);

  const renderItem = useCallback(({ item, index } : { item: IMovie, index: number }) => (
    <View style={style.movieContainer}>
      <Text style={style.text}>{index + 1}. {item.title}</Text>
      <Text style={style.text}>{item.overview}</Text>
    </View>
  ), [style]);

  const HeaderComponent = useMemo(() => (
    <View style={style.header}>
      <Button title="Get movies" onPress={getMovies} />
      <Button title="Change theme" onPress={toggleTheme} />
    </View>
  ), [getMovies, toggleTheme, style]);

  const EmptyComponent = useMemo(() => (
    <Text style={style.textCenter}>{'No movies found'}</Text>
  ), [style]);

  const SeparatorComponent = useCallback(() => (
    <View style={style.separator} />
  ), [style]);

  return (
    <View style={style.container}>
      {HeaderComponent}
      <FlashList
        style={style.container}
        keyExtractor={(item) => item.id}
        data={movies}
        renderItem={renderItem}
        ListEmptyComponent={EmptyComponent}
        onEndReached={getMovies}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={SeparatorComponent}
      />
    </View>
  );
};

export default Movies;
