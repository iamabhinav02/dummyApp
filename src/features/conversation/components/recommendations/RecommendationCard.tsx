import React from 'react';
import { Alert, Pressable, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useAppContext } from '../../../../context/appContext';
import Text from '../../../../common/ui/Text';
import { Recommendation } from '../../../../types/conversation';
import { getRecommendationDescriptor } from './recommendationRegistry';
import useStyles, { createAccentStyles } from './styles';

type Props = {
  recommendation: Recommendation;
  onPress?: (recommendation: Recommendation) => void;
};

/**
 * Renders a single recommendation using the descriptor for its type. The card
 * itself is type-agnostic: icon, accent, CTA and (optional) custom body all
 * come from the registry, so new experiences need no changes here.
 */
const RecommendationCard: React.FC<Props> = ({ recommendation, onPress }) => {
  const { colors } = useAppContext();
  const styles = useStyles(colors);
  const descriptor = getRecommendationDescriptor(recommendation.type);
  const accent = colors.ACCENT[descriptor.accentKey];
  const accentStyles = createAccentStyles(accent);

  const handlePress = () => {
    if (onPress) {
      onPress(recommendation);
      return;
    }
    Alert.alert(recommendation.title, `Opening the ${recommendation.type} experience.`);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`${recommendation.title} recommendation`}
    >
      <View style={[styles.iconChip, accentStyles.iconChipTint]}>
        <Icon source={descriptor.icon} size={20} color={accent} />
      </View>

      <View style={styles.body}>
        <Text variant="title" numberOfLines={2} style={styles.title}>
          {recommendation.title}
        </Text>
        {descriptor.renderBody
          ? descriptor.renderBody(recommendation, accent)
          : !!recommendation.subtitle && (
              <Text variant="body" numberOfLines={2}>
                {recommendation.subtitle}
              </Text>
            )}
      </View>

      <View style={[styles.cta, accentStyles.ctaBorder]}>
        <Text variant="label" style={accentStyles.ctaText}>
          {descriptor.ctaLabel}
        </Text>
      </View>
    </Pressable>
  );
};

export default RecommendationCard;
