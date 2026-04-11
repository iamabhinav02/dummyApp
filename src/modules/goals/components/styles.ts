import { StyleSheet } from 'react-native';
import { radius, spacing } from '../../../common/ui/tokens';

const styles = () => StyleSheet.create({
  card: {
    gap: spacing.sm,
  },
  progressWrap: {
    width: '100%',
    height: 10,
    borderRadius: radius.sm,
    backgroundColor: '#CBD5E1',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.sm,
    backgroundColor: '#2563EB',
  },
});

export default styles;
