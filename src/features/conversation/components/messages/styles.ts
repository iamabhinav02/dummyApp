import { StyleSheet } from 'react-native';
import { IColors } from '../../../../constants/colors';
import { radius, spacing } from '../../../../common/ui/tokens';

const useStyles = (colors: IColors) => StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
  },
  rowLeft: {
    justifyContent: 'flex-start',
  },
  rowRight: {
    justifyContent: 'flex-end',
  },
  column: {
    maxWidth: '92%',
  },
  columnRight: {
    alignItems: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  headerLabel: {
    color: colors.TEXT.SECONDARY,
  },
  bubble: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  bubbleLeft: {
    borderTopLeftRadius: radius.sm,
  },
  bubbleRight: {
    borderTopRightRadius: radius.sm,
  },
  humanBubble: {
    borderWidth: 1,
    borderColor: colors.ACCENT.TEAL,
  },
  extras: {
    marginTop: spacing.xs,
    width: '100%',
  },

  // Reply preview strip inside a bubble
  replyStrip: {
    borderLeftWidth: 3,
    opacity: 0.7,
    paddingLeft: spacing.sm,
    marginBottom: spacing.xs,
  },

  // System event
  systemRow: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  systemChip: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.SURFACE.TERTIARY,
  },
  systemText: {
    color: colors.TEXT.SECONDARY,
    textAlign: 'center',
  },

  // Delivery status
  statusRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  statusText: {
    color: colors.TEXT.TERTIARY,
  },
  retryText: {
    color: colors.BUTTONS.PRIMARY,
  },

  // Feedback (like / dislike + reason chips)
  feedbackContainer: {
    marginTop: spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  ratingButton: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.SURFACE.TERTIARY,
    backgroundColor: colors.SURFACE.PRIMARY,
  },
  ratingButtonActive: {
    backgroundColor: colors.BUTTONS.PRIMARY,
    borderColor: colors.BUTTONS.PRIMARY,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
});

/**
 * Per-bubble styles that depend on runtime colors (the author's bubble/text
 * colors, themselves sourced from the palette). Kept out of JSX so no inline
 * style objects are needed.
 */
export const createBubbleColorStyles = (bubbleColor: string, textColor: string) =>
  StyleSheet.create({
    bubble: {
      backgroundColor: bubbleColor,
    },
    replyBorder: {
      borderLeftColor: textColor,
    },
    text: {
      color: textColor,
    },
  });

export default useStyles;
