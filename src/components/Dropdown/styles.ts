import { StyleSheet } from 'react-native';
import { IColors } from '../../constants/colors';

const styles = (color: IColors) => StyleSheet.create({
  container: {
    backgroundColor: color.SURFACE.PRIMARY,
    marginBottom: 24,
  },
  text: {
    color: color.TEXT.PRIMARY,
  },
  label: {
    textAlign: 'left',
    marginBottom: 6,
    fontSize: 14,
    color: color.TEXT.SECONDARY,
  },

  trigger: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: color.SURFACE.TERTIARY,
    backgroundColor: color.SURFACE.PRIMARY,
  },

  disabled: {
    opacity: 0.5,
  },

  triggerText: {
    fontSize: 16,
    color: color.TEXT.PRIMARY,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '50%',
    backgroundColor: color.SURFACE.PRIMARY,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: color.SURFACE.TERTIARY,
  },
  emptyText: {
    color: color.TEXT.SECONDARY,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 32,
  },
});

export default styles;
