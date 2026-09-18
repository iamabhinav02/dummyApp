import React from 'react';
import { Pressable, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useAppContext } from '../../../../context/appContext';
import Chip from '../../../../common/ui/Chip';
import { FEEDBACK_REASON, REACTION_TYPE } from '../../../../enums/conversation';
import { FeedbackReason, ReactionType, Reaction } from '../../../../types/conversation';
import useStyles from './styles';

type Props = {
  reactions: Reaction[];
  /** The viewer's userId, used to derive their own like/dislike + reasons. */
  localUserId: string;
  onToggleReaction: (reactionType: ReactionType) => void;
  onToggleReason: (reason: FeedbackReason) => void;
};

const REASONS: { key: FeedbackReason; label: string }[] = [
  { key: FEEDBACK_REASON.INACCURATE, label: 'Inaccurate' },
  { key: FEEDBACK_REASON.TOO_GENERIC, label: 'Too Generic' },
  { key: FEEDBACK_REASON.DIDNT_HELP, label: "Didn't Help" },
  { key: FEEDBACK_REASON.TOO_LONG, label: 'Too Long' },
];

/**
 * Like / dislike control for AI messages, backed by the viewer's reactions;
 * a dislike expands reason chips (stored as that reaction's comments).
 */
const FeedbackBar: React.FC<Props> = ({
  reactions,
  localUserId,
  onToggleReaction,
  onToggleReason,
}) => {
  const { colors } = useAppContext();
  const styles = useStyles(colors);

  const mine = reactions.filter((r) => r.userId === localUserId);
  const dislike = mine.find((r) => r.reactionType === REACTION_TYPE.DISLIKE);
  const hasLike = mine.some((r) => r.reactionType === REACTION_TYPE.LIKE);
  const reasons = dislike?.comments ?? [];

  const renderRating = (
    value: ReactionType,
    active: boolean,
    activeIcon: string,
    idleIcon: string,
    label: string,
  ) => (
    <Pressable
      onPress={() => onToggleReaction(value)}
      style={[styles.ratingButton, active && styles.ratingButtonActive]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
    >
      <Icon
        source={active ? activeIcon : idleIcon}
        size={18}
        color={active ? colors.TEXT.INVERSE : colors.TEXT.SECONDARY}
      />
    </Pressable>
  );

  return (
    <View style={styles.feedbackContainer}>
      <View style={styles.ratingRow}>
        {renderRating(REACTION_TYPE.LIKE, hasLike, 'thumb-up', 'thumb-up-outline', 'Like response')}
        {renderRating(REACTION_TYPE.DISLIKE, !!dislike, 'thumb-down', 'thumb-down-outline', 'Dislike response')}
      </View>

      {!!dislike && (
        <View style={styles.chipsRow}>
          {REASONS.map((reason) => (
            <Chip
              key={reason.key}
              label={reason.label}
              selected={reasons.includes(reason.key)}
              onPress={() => onToggleReason(reason.key)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default FeedbackBar;
