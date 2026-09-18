import { StyleSheet } from 'react-native';
import { IColors } from '../../../../constants/colors';
import { spacing } from '../../../../common/ui/tokens';

const useStyles = (colors: IColors) => StyleSheet.create({
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  actionLabel: {
    color: colors.TEXT.PRIMARY,
  },
  actionLabelDestructive: {
    color: colors.STATUS.DANGER,
  },
});

export default useStyles;
