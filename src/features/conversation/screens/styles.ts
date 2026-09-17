import { StyleSheet } from 'react-native';
import { IColors } from '../../../constants/colors';
import { spacing } from '../../../common/ui/tokens';

const useStyles = (colors: IColors) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.SURFACE.PRIMARY,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.SURFACE.TERTIARY,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  subtitle: {
    color: colors.TEXT.TERTIARY,
  },
  body: {
    flex: 1,
  },
  composerArea: {
    backgroundColor: colors.SURFACE.PRIMARY,
  },
});

export default useStyles;
