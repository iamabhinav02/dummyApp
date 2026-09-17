import React from 'react';
import Text from '../../../../common/ui/Text';
import { AccentColor } from '../../../../constants/colors';
import {
  KnownRecommendationType,
  Recommendation,
  RecommendationType,
} from '../../../../types/conversation';
import { createAccentStyles } from './styles';

/**
 * Describes how a recommendation type is presented. Adding a new experience is
 * a matter of registering one descriptor here (or at runtime via
 * `registerRecommendation`) — the timeline, message and carousel code never
 * change. Unknown types fall back to a generic descriptor, so the client can
 * render future backend experiences before a dedicated renderer ships.
 */
export type RecommendationDescriptor = {
  /** MDI icon name (rendered via react-native-paper Icon). */
  icon: string;
  /** Accent palette key used for the icon chip and call-to-action. */
  accentKey: AccentColor;
  /** Call-to-action label on the card. */
  ctaLabel: string;
  /**
   * Optional custom body. Receives the resolved accent color so it can theme
   * itself. When omitted the card renders title + subtitle. This is the seam
   * that lets a type bring its own richer UI.
   */
  renderBody?: (recommendation: Recommendation, accent: string) => React.ReactNode;
};

const registry: Record<KnownRecommendationType, RecommendationDescriptor> = {
  gemstone: { icon: 'diamond-stone', accentKey: 'BLUE', ctaLabel: 'View gemstone' },
  tarot: {
    icon: 'cards-playing-outline',
    accentKey: 'VIOLET',
    ctaLabel: 'Pull cards',
    // Example of a type-specific body renderer.
    renderBody: (recommendation, accent) => (
      <>
        {!!recommendation.subtitle && <Text variant="body">{recommendation.subtitle}</Text>}
        <Text variant="label" style={createAccentStyles(accent).bodyAccent}>
          3-card spread
        </Text>
      </>
    ),
  },
  consultation: { icon: 'account-voice', accentKey: 'GREEN', ctaLabel: 'Talk now' },
  article: { icon: 'book-open-variant', accentKey: 'AMBER', ctaLabel: 'Read article' },
  promotion: { icon: 'tag-heart', accentKey: 'ROSE', ctaLabel: 'Claim offer' },
  remedy: { icon: 'candle', accentKey: 'TEAL', ctaLabel: 'View remedy' },
  panchang: { icon: 'calendar-star', accentKey: 'INDIGO', ctaLabel: 'Open panchang' },
};

/** Generic descriptor for unregistered / future recommendation types. */
const FALLBACK_DESCRIPTOR: RecommendationDescriptor = {
  icon: 'star-four-points',
  accentKey: 'SLATE',
  ctaLabel: 'Explore',
};

export const getRecommendationDescriptor = (
  type: RecommendationType,
): RecommendationDescriptor =>
  registry[type as KnownRecommendationType] ?? FALLBACK_DESCRIPTOR;

/** Runtime extension point — register a new experience without a code change here. */
export const registerRecommendation = (
  type: string,
  descriptor: RecommendationDescriptor,
) => {
  registry[type as KnownRecommendationType] = descriptor;
};
