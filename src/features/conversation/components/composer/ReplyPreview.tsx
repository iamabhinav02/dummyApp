import React from 'react';
import { Pressable, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useAppContext } from '../../../../context/appContext';
import Text from '../../../../common/ui/Text';
import { ReplyContext } from '../../../../types/conversation';
import useStyles from './styles';

type Props = {
  reply: ReplyContext;
  onClear: () => void;
};

const AUTHOR_NAME: Record<string, string> = {
  user: 'You',
  ai: 'AI Astrologer',
  human: 'Astrologer',
  system: 'System',
};

/** Preview strip shown above the composer when replying to a message. */
const ReplyPreview: React.FC<Props> = ({ reply, onClear }) => {
  const { colors } = useAppContext();
  const styles = useStyles(colors);

  return (
    <View style={styles.replyContainer}>
      <Icon source="reply" size={16} color={colors.TEXT.SECONDARY} />
      <View style={styles.replyBody}>
        <Text variant="label" style={styles.replyingLabel}>
          {AUTHOR_NAME[reply.author] ?? 'message'}
        </Text>
        <Text variant="body" numberOfLines={1} style={styles.replyPreviewText}>
          {reply.preview}
        </Text>
      </View>
      <Pressable onPress={onClear} accessibilityRole="button" accessibilityLabel="Cancel reply">
        <Icon source="close" size={18} color={colors.TEXT.SECONDARY} />
      </Pressable>
    </View>
  );
};

export default ReplyPreview;
