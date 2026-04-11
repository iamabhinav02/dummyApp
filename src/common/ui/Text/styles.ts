import { StyleSheet } from 'react-native';
import { IColors } from '../../../constants/colors';
import { typography } from '../tokens';

const useStyles = (colors: IColors) => StyleSheet.create({
  base: {
    includeFontPadding: false,
    color: colors.TEXT.PRIMARY,
  },
  heading: typography.heading,
  title: typography.title,
  body: typography.body,
  label: typography.label,
});

export default useStyles;
