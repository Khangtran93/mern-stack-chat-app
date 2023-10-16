import { Box, useToast, Text, Button, Stack, Skeleton } from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../Content/chatProvider";
import axios from "axios";
import { useEffect } from "react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoader from "./ChatLoader";
import GroupChatModal from "./GroupChatModal";
import { getSender } from "../../config/ChatLogic";
import { calcLength } from "framer-motion";

const MyChats = ({ refetch }) => {
  const {
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchChat = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
      setLoading(false);
    } catch (err) {
      toast({
        title: "Failed to fetch Chat",
        description: err.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChat();
  }, [refetch]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      px={2}
      py={1}
      width={{ base: "100%", md: "31%" }}
      bg="white"
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        fontFamily="Work sans"
        overflow="hidden"
      >
        <Text
          overflow="hidden"
          fontSize={{ base: "20px", md: "20px", lg: "30px" }}
        >
          My Chats
        </Text>
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      {/* if there is chats, render a stack of chats */}
      {chats ? (
        <Stack overflow="auto" w="100%" py={3} maxHeight="550px" bg="white">
          {chats.map((chat) => (
            <Box
              key={chat._id}
              cursor="pointer"
              borderRadius="lg"
              w="97%"
              onClick={() => {
                setSelectedChat(chat);
                console.log("Notification: ", notification);
                // notification.chat.includes(chat) &&
                setNotification(
                  notification.filter((n) => n.chat._id !== chat._id)
                );
              }}
              display="flex"
              bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
              color={selectedChat === chat && "white"}
              px={3}
              py={2}
              justifyContent="space-between"
            >
              <Text>
                {!chat.isGroupChat
                  ? getSender(user, chat.users)
                  : chat.chatName}
              </Text>
            </Box>
          ))}
        </Stack>
      ) : (
        <Text>Loading...</Text>
      )}
    </Box>
  );
};

export default MyChats;
