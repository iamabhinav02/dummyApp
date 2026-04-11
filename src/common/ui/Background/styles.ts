import { StyleSheet } from 'react-native';
import { IColors } from '../../../constants/colors';
import { spacing } from '../tokens';

const useStyles = (color: IColors) => StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxxl,
    backgroundColor: color.SURFACE.PRIMARY,
  },
});

export default useStyles;
