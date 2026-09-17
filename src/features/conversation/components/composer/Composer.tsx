import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useAppContext } from '../../../../context/appContext';
import { ReplyContext } from '../../../../types/conversation';
import ReplyPreview from './ReplyPreview';
import useStyles from './styles';

type Props = {
  reply: ReplyContext | null;
  onSend: (text: string) => void;
  onClearReply: () => void;
};

/** Message composer with an optional reply preview and a send action. */
const Composer: React.FC<Props> = ({ reply, onSend, onClearReply }) => {
  const { colors } = useAppContext();
  const styles = useStyles(colors);
  const [text, setText] = useState('');

  const canSend = text.trim().length > 0;

  const handleSend = () => {
    if (!canSend) {
      return;
    }
    onSend(text);
    setText('');
  };

  return (
    <View style={styles.wrapper}>
      {!!reply && <ReplyPreview reply={reply} onClear={onClearReply} />}

      <View style={styles.inputRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Ask the AI astrologer…"
          placeholderTextColor={colors.TEXT.TERTIARY}
          style={styles.input}
          multiline
        />
        <Pressable
          onPress={handleSend}
          disabled={!canSend}
          style={[styles.sendButton, canSend ? styles.sendButtonEnabled : styles.sendButtonDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Send message"
        >
          <Icon source="send" size={20} color={colors.TEXT.INVERSE} />
        </Pressable>
      </View>
    </View>
  );
};

export default Composer;
