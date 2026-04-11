import { StyleSheet } from 'react-native';
import { IColors } from '../../../constants/colors';
import { radius, spacing } from '../tokens';

const useStyles = (_colors: IColors) => StyleSheet.create({
  button: {
    minHeight: 42,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default useStyles;
