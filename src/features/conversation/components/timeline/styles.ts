import { StyleSheet } from 'react-native';
import { IColors } from '../../../../constants/colors';
import { spacing } from '../../../../common/ui/tokens';

// `_colors` kept so this hook matches the (colors) signature of the other useStyles hooks.
const useStyles = (_colors: IColors) => StyleSheet.create({
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
});

export default useStyles;
