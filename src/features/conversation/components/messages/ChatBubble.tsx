import React from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import moment from 'moment';
import { Icon } from 'react-native-paper';
import { useAppContext } from '../../../../context/appContext';
import Text from '../../../../common/ui/Text';
import { MESSAGE_AUTHOR } from '../../../../enums/conversation';
import { MessageAuthorType, ReplyContext } from '../../../../types/conversation';
import useStyles, { createBubbleColorStyles } from './styles';

type Props = {
  align: 'left' | 'right';
  /** Author header (icon + label + time) shown at the start of a group. */
  showHeader: boolean;
  headerIcon?: string;
  headerLabel?: string;
  timestamp: number;
  bubbleColor: string;
  textColor: string;
  bubbleStyle?: StyleProp<ViewStyle>;
  replyTo?: ReplyContext;
  onLongPress?: () => void;
  /** Rendered under the bubble, inside the aligned column (status, feedback, etc.). */
  extras?: React.ReactNode;
  children: React.ReactNode;
};

const authorName: Record<MessageAuthorType, string> = {
  [MESSAGE_AUTHOR.USER]: 'You',
  [MESSAGE_AUTHOR.AI]: 'AI Astrologer',
  [MESSAGE_AUTHOR.HUMAN]: 'Astrologer',
  [MESSAGE_AUTHOR.SYSTEM]: 'System',
};

const ChatBubble: React.FC<Props> = ({
  align,
  showHeader,
  headerIcon,
  headerLabel,
  timestamp,
  bubbleColor,
  textColor,
  bubbleStyle,
  replyTo,
  onLongPress,
  extras,
  children,
}) => {
  const { colors } = useAppContext();
  const styles = useStyles(colors);
  const colorStyles = createBubbleColorStyles(bubbleColor, textColor);
  const isRight = align === 'right';

  return (
    <View style={[styles.row, isRight ? styles.rowRight : styles.rowLeft]}>
      <View style={[styles.column, isRight && styles.columnRight]}>
        {showHeader && !!headerLabel && (
          <View style={styles.header}>
            {!!headerIcon && <Icon source={headerIcon} size={14} color={colors.TEXT.SECONDARY} />}
            <Text variant="label" style={styles.headerLabel}>
              {headerLabel}
            </Text>
            <Text variant="label" style={styles.headerLabel}>
              · {moment(timestamp).format('h:mm A')}
            </Text>
          </View>
        )}

        <Pressable
          onLongPress={onLongPress}
          disabled={!onLongPress}
          delayLongPress={250}
          style={[
            styles.bubble,
            isRight ? styles.bubbleRight : styles.bubbleLeft,
            colorStyles.bubble,
            bubbleStyle,
          ]}
        >
          {!!replyTo && (
            <View style={[styles.replyStrip, colorStyles.replyBorder]}>
              <Text variant="label" style={colorStyles.text}>
                {authorName[replyTo.author] ?? 'Message'}
              </Text>
              <Text variant="body" numberOfLines={1} style={colorStyles.text}>
                {replyTo.preview}
              </Text>
            </View>
          )}

          {typeof children === 'string' ? (
            <Text variant="body" style={colorStyles.text}>
              {children}
            </Text>
          ) : (
            children
          )}
        </Pressable>

        {!!extras && <View style={styles.extras}>{extras}</View>}
      </View>
    </View>
  );
};

export default ChatBubble;
