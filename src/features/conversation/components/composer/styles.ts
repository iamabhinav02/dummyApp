import { StyleSheet } from 'react-native';
import { IColors } from '../../../../constants/colors';
import { radius, spacing } from '../../../../common/ui/tokens';

const useStyles = (colors: IColors) => StyleSheet.create({
  // Composer
  wrapper: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.SURFACE.TERTIARY,
    backgroundColor: colors.SURFACE.PRIMARY,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    minHeight: 44,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: colors.SURFACE.SECONDARY,
    color: colors.TEXT.PRIMARY,
    borderWidth: 1,
    borderColor: colors.SURFACE.TERTIARY,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonEnabled: {
    backgroundColor: colors.BUTTONS.PRIMARY,
  },
  sendButtonDisabled: {
    backgroundColor: colors.SURFACE.TERTIARY,
  },

  // Reply preview
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderTopLeftRadius: radius.sm,
    borderTopRightRadius: radius.sm,
    backgroundColor: colors.SURFACE.SECONDARY,
    borderLeftWidth: 3,
    borderLeftColor: colors.BUTTONS.PRIMARY,
  },
  replyBody: {
    flex: 1,
  },
  replyingLabel: {
    color: colors.BUTTONS.PRIMARY,
  },
  replyPreviewText: {
    color: colors.TEXT.SECONDARY,
  },
});

export default useStyles;
