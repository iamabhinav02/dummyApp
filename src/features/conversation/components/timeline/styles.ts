import { StyleSheet } from 'react-native';
import { IColors } from '../../../../constants/colors';
import { spacing } from '../../../../common/ui/tokens';

const useStyles = (colors: IColors) => StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  // Extra top margin when a message starts a new group vs. continues one.
  rowGroupStart: {
    marginTop: spacing.md,
  },
  rowGrouped: {
    marginTop: spacing.xs,
  },
  // Date separator
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  separatorLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.SURFACE.TERTIARY,
  },
  separatorLabel: {
    color: colors.TEXT.TERTIARY,
  },
});

export default useStyles;
