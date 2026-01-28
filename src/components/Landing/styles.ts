import { StyleSheet } from 'react-native';
import { IColors } from '../../constants/colors';

const styles = (color: IColors) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.SURFACE.PRIMARY,
  },
  text: {
    color: color.TEXT.PRIMARY,
  },
});

export default styles;
