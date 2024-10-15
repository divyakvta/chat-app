import React from 'react';
import { ChatState } from '../Context/chatProvider';
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';
import { Avatar, Tooltip } from '@chakra-ui/react';

function ScrollableChat({ messages }) {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages && messages.map((m, i) => (
        <div style={{ display: "flex", alignItems: "flex-start" }} key={m._id}>
          {/* Check if m.sender exists to avoid errors */}
          {m.sender && (isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
            <Tooltip label={m.sender.name} placement='bottom-start' hasArrow>
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                name={m.sender.name}
                src={m.sender.pic}
              />
            </Tooltip>
          )}

          {/* Message content */}
          {m.sender && (
            <span
              style={{
                backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                display: "inline-block", 
              }}
            >
              {m.content}
            </span>
          )}
        </div>
      ))}
    </ScrollableFeed>
  );
}

export default ScrollableChat;
