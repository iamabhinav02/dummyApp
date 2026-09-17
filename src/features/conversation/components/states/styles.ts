import { StyleSheet } from 'react-native';
import { IColors } from '../../../../constants/colors';
import { spacing } from '../../../../common/ui/tokens';

const useStyles = (colors: IColors) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  text: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: colors.TEXT.SECONDARY,
  },
});

export default useStyles;
