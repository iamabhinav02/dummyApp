import { StyleSheet } from 'react-native';
import { spacing } from '../../../common/ui/tokens';

const styles = () => StyleSheet.create({
  card: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
});

export default styles;
