import { StyleSheet } from 'react-native';
import { IColors } from '../../../constants/colors';
import { spacing } from '../tokens';

const useStyles = (colors: IColors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  rule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.SURFACE.TERTIARY,
  },
  label: {
    color: colors.TEXT.TERTIARY,
  },
  // Plain full-width rule (no label).
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.SURFACE.TERTIARY,
    marginVertical: spacing.md,
  },
});

export default useStyles;
