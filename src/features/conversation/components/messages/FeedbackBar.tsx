import React from 'react';
import { Pressable, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useAppContext } from '../../../../context/appContext';
import Text from '../../../../common/ui/Text';
import { FEEDBACK_RATING, FEEDBACK_REASON } from '../../../../enums/conversation';
import { FeedbackRating, FeedbackReason, MessageFeedback } from '../../../../types/conversation';
import useStyles from './styles';

type Props = {
  feedback?: MessageFeedback;
  onSetRating: (rating: FeedbackRating) => void;
  onToggleReason: (reason: FeedbackReason) => void;
};

const REASONS: { key: FeedbackReason; label: string }[] = [
  { key: FEEDBACK_REASON.INACCURATE, label: 'Inaccurate' },
  { key: FEEDBACK_REASON.TOO_GENERIC, label: 'Too Generic' },
  { key: FEEDBACK_REASON.DIDNT_HELP, label: "Didn't Help" },
  { key: FEEDBACK_REASON.TOO_LONG, label: 'Too Long' },
];

/** Like / dislike control for AI messages; dislike expands reason chips. */
const FeedbackBar: React.FC<Props> = ({ feedback, onSetRating, onToggleReason }) => {
  const { colors } = useAppContext();
  const styles = useStyles(colors);
  const rating = feedback?.rating;
  const reasons = feedback?.reasons ?? [];

  const renderRating = (value: FeedbackRating, activeIcon: string, idleIcon: string) => {
    const active = rating === value;
    return (
      <Pressable
        onPress={() => onSetRating(value)}
        style={[styles.ratingButton, active && styles.ratingButtonActive]}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        accessibilityLabel={value === FEEDBACK_RATING.LIKE ? 'Like response' : 'Dislike response'}
      >
        <Icon
          source={active ? activeIcon : idleIcon}
          size={18}
          color={active ? colors.TEXT.INVERSE : colors.TEXT.SECONDARY}
        />
      </Pressable>
    );
  };

  return (
    <View style={styles.feedbackContainer}>
      <View style={styles.ratingRow}>
        {renderRating(FEEDBACK_RATING.LIKE, 'thumb-up', 'thumb-up-outline')}
        {renderRating(FEEDBACK_RATING.DISLIKE, 'thumb-down', 'thumb-down-outline')}
      </View>

      {rating === FEEDBACK_RATING.DISLIKE && (
        <View style={styles.chipsRow}>
          {REASONS.map((reason) => {
            const selected = reasons.includes(reason.key);
            return (
              <Pressable
                key={reason.key}
                onPress={() => onToggleReason(reason.key)}
                style={[styles.chip, selected && styles.chipSelected]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <Text
                  variant="label"
                  style={selected ? styles.chipTextSelected : styles.chipText}
                >
                  {reason.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default FeedbackBar;
