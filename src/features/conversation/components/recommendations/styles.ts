import { StyleSheet } from 'react-native';
import { IColors } from '../../../../constants/colors';
import { radius, shadow, spacing } from '../../../../common/ui/tokens';

const useStyles = (colors: IColors) => StyleSheet.create({
  carouselContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  card: {
    width: 184,
    minHeight: 150,
    borderRadius: radius.md,
    padding: spacing.md,
    marginRight: spacing.sm,
    backgroundColor: colors.SURFACE.PRIMARY,
    borderWidth: 1,
    borderColor: colors.SURFACE.TERTIARY,
    justifyContent: 'space-between',
    ...shadow.card,
  },
  iconChip: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  body: {
    flex: 1,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 15,
    marginBottom: 2,
  },
  cta: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
});

/**
 * Accent-dependent styles for a card. The accent is a palette color resolved
 * from the theme, so these stay out of JSX (no inline style objects) while
 * remaining per-recommendation-type.
 */
export const createAccentStyles = (accent: string) =>
  StyleSheet.create({
    // 10% alpha tint of the accent for the icon chip background.
    iconChipTint: {
      backgroundColor: `${accent}1A`,
    },
    ctaBorder: {
      borderColor: accent,
    },
    ctaText: {
      color: accent,
    },
    bodyAccent: {
      color: accent,
      marginTop: spacing.xs,
    },
  });

export default useStyles;
