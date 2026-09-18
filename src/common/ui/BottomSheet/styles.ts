import { StyleSheet } from 'react-native';
import { IColors } from '../../../constants/colors';
import { radius, shadow, spacing } from '../tokens';

const useStyles = (colors: IColors) => StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.SURFACE.SCRIM,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.SURFACE.PRIMARY,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    ...shadow.card,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.SURFACE.TERTIARY,
    marginVertical: spacing.sm,
  },
});

export default useStyles;
