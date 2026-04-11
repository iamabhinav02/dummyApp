import { StyleSheet } from 'react-native';
import { IColors } from '../../../constants/colors';
import { radius, shadow, spacing } from '../tokens';

const useStyles = (colors: IColors) => StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.SURFACE.SECONDARY,
    borderColor: colors.SURFACE.TERTIARY,
    ...shadow.card,
  },
});

export default useStyles;
