import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../../Content/chatProvider";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogic";
import { Avatar, Text, Tooltip } from "@chakra-ui/react";

const ScrollableMessage = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div
            style={{
              display: "flex",
            }}
            key={m._id}
          >
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} hasArrow placement="bottom-start">
                <Avatar
                  mt="7px"
                  mr={2}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.profilePicture}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",

                cursor: "pointer",
              }}
            >
              {m.content}
              <Text fontSize="xs" color="blue" ml="auto">
                {m.createdAt.slice(11, 16)}
              </Text>
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableMessage;
