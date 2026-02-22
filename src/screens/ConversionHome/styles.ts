import { StyleSheet } from 'react-native';
import { IColors } from '../../constants/colors';
import { initialWindowMetrics } from 'react-native-safe-area-context';

const styles = (color: IColors) => StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: initialWindowMetrics?.insets.top || 0,
    paddingHorizontal: 24,
    backgroundColor: color.SURFACE.PRIMARY,
  },
  text: {
    color: color.TEXT.PRIMARY,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    gap: 16,
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: color.TEXT.PRIMARY,
  },
  buttonContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
});

export default styles;
