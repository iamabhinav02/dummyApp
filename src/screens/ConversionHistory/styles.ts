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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  headerText: {
    fontSize: 16,
    color: color.TEXT.PRIMARY,
  },
  itemContainer: {
    marginBottom: 24,
    gap: 6,
  },
  itemText: {
    fontSize: 14,
    color: color.TEXT.SECONDARY,
  },
  timestamp: {
    fontSize: 12,
    color: color.TEXT.SECONDARY,
  },
});

export default styles;
