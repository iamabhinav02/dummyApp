import React from 'react';
import { FlatList } from 'react-native';
import { useAppContext } from '../../../../context/appContext';
import { Recommendation } from '../../../../types/conversation';
import RecommendationCard from './RecommendationCard';
import useStyles from './styles';

type Props = {
  recommendations: Recommendation[];
  onPressCard?: (recommendation: Recommendation) => void;
};

/** Horizontally scrolling row of recommendation cards attached to an AI message. */
const RecommendationCarousel: React.FC<Props> = ({ recommendations, onPressCard }) => {
  const { colors } = useAppContext();
  const styles = useStyles(colors);

  if (!recommendations.length) {
    return null;
  }

  return (
    <FlatList
      horizontal
      data={recommendations}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <RecommendationCard recommendation={item} onPress={onPressCard} />
      )}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carouselContent}
    />
  );
};

export default RecommendationCarousel;
