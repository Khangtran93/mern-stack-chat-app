import { Box, Text, useToast } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../Content/chatProvider";
import SingleChat from "./SingleChat";
import { set } from "mongoose";

const Convo = ({ refetch, setRefetch }) => {
  const { selectedChat, setSelectedChat, chats, setChats, user } = ChatState();
  // setSelectedChat(chats[chats[0]]);
  // console.log(selectedChat);
  const toast = useToast();
  return (
    <Box
      flexDir="column"
      alignItems="center"
      px={2}
      py={1}
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      width={{ base: "100%", md: "68%" }}
      bg="white"
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat refetch={refetch} setRefetch={setRefetch} />
    </Box>
  );
};

export default Convo;
