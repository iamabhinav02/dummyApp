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
    gap: spacing.sm,
  },
  form: {
    gap: spacing.md,
  },
  actions: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  listContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
});

export default styles;
