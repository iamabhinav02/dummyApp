import { StyleSheet } from 'react-native';
import { IColors } from '../../../constants/colors';
import { radius, spacing } from '../tokens';

const useStyles = (colors: IColors) => StyleSheet.create({
  chip: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.SURFACE.TERTIARY,
    backgroundColor: colors.SURFACE.PRIMARY,
  },
  chipSelected: {
    backgroundColor: colors.BUTTONS.PRIMARY,
    borderColor: colors.BUTTONS.PRIMARY,
  },
  chipText: {
    color: colors.TEXT.SECONDARY,
  },
  chipTextSelected: {
    color: colors.TEXT.INVERSE,
  },
});

export default useStyles;
