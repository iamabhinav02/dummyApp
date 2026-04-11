import { StyleSheet } from 'react-native';
import { spacing } from '../../../common/ui/tokens';

const styles = () => StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actions: {
    gap: spacing.sm,
  },
  listContent: {
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  tipCard: {
    gap: spacing.sm,
  },
});

export default styles;
