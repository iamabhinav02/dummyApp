import { StyleSheet } from 'react-native';
import { spacing } from '../../common/ui/tokens';

const styles = () => StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  subtitle: {
    marginBottom: spacing.md,
  },
  listContent: {
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  moduleCard: {
    gap: spacing.sm,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  moduleAction: {
    marginTop: spacing.sm,
  },
});

export default styles;
