import { StyleSheet } from 'react-native';
import { spacing } from '../../common/ui/tokens';

const styles = () => StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
});

export default styles;
