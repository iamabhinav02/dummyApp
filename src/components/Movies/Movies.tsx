import React, { useCallback, useMemo } from 'react';
import { View, Button, Text } from 'react-native';
import {  useSelector } from 'react-redux';
import { ICombinedAppState } from '../../store';
import MovieController from '../../controllers/MovieController';
import styles from './styles';
import { FlashList } from '@shopify/flash-list';
import { IMovie } from '../../types/reducers';

const SeparatorComponent = () => (
  <View style={styles.separator} />
);

const Movies: React.FC = () => {
  const { popularMovies } = useSelector((selector: ICombinedAppState) => selector.movieReducer);
  const { pageIndex, movies } = popularMovies;

  const getMovies = useCallback(() => {
    MovieController.getPopularMovies(pageIndex + 1);
  }, [pageIndex]);

  const renderItem = useCallback(({ item, index } : { item: IMovie, index: number }) => (
    <View style={styles.movieContainer}>
      <Text style={styles.text}>{index + 1}. {item.title}</Text>
      <Text style={styles.text}>{item.overview}</Text>
    </View>
  ), []);

  const HeaderComponent = useMemo(() => (
    <View style={styles.header}>
      <Button title="Get movies" onPress={getMovies} />
    </View>
  ), [getMovies]);

  const EmptyComponent = useMemo(() => (
    <Text style={styles.textCenter}>{'No movies found'}</Text>
  ), []);

  return (
    <View style={styles.container}>
      {HeaderComponent}
      <FlashList
        style={styles.container}
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
