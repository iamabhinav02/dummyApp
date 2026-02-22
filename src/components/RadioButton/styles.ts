import { StyleSheet } from 'react-native';
import { IColors } from '../../constants/colors';

const styles = (color: IColors) => StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  optionText: {
    fontSize: 16,
    color: color.TEXT.PRIMARY,
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: color.BUTTONS.PRIMARY,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.SURFACE.PRIMARY,
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: color.BUTTONS.PRIMARY,
  },
});

export default styles;
