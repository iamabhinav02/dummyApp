import { StyleSheet } from 'react-native';
import { IColors } from '../../constants/colors';

const styles = (color: IColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.SURFACE.PRIMARY,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: color.SURFACE.TERTIARY,
  },
});

export default styles;
