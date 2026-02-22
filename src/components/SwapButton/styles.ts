import { StyleSheet } from 'react-native';
import { IColors } from '../../constants/colors';

const styles = (colors: IColors) => StyleSheet.create({
  button: {
    alignSelf: 'center',
    marginVertical: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.SURFACE.SECONDARY,
    borderColor: colors.SURFACE.TERTIARY,
  },
});

export default styles;
