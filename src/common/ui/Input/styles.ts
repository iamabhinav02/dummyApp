import { StyleSheet } from 'react-native';
import { IColors } from '../../../constants/colors';
import { radius, spacing } from '../tokens';

const useStyles = (color: IColors) => StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  input: {
    minHeight: 44,
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    color: color.TEXT.PRIMARY,
    borderColor: color.SURFACE.TERTIARY,
    backgroundColor: color.SURFACE.PRIMARY,
  },
});

export default useStyles;
