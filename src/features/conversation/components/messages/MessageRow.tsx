import React from 'react';
import { getMessageComponent } from './messageRegistry';
import { MessageComponentProps } from './messageTypes';

/**
 * Thin dispatcher: picks the renderer for a message's author type from the
 * registry. Memoized so unrelated timeline updates don't re-render every row.
 */
const MessageRow: React.FC<MessageComponentProps> = (props) => {
  const Component = getMessageComponent(props.message.type);
  return <Component {...props} />;
};

export default React.memo(MessageRow);
