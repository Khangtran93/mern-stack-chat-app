import React, { useEffect, useState } from "react";
import { ChatState } from "../Content/chatProvider";
import SideBar from "../Components/Chat Components/SideBar";
import MyChats from "../Components/Chat Components/MyChats";
import Convo from "../Components/Chat Components/Convo";
import { Box } from "@chakra-ui/react";
import axios from "axios";

const ChatPage = () => {
  const [refetch, setRefetch] = useState(false);
  const { user } = ChatState();
  return (
    <div style={{ width: "100%" }}>
      {user && <SideBar />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5%"
        p="10px"
      >
        {user && <MyChats refetch={refetch} />}
        {user && <Convo refetch={refetch} setRefetch={setRefetch} />}
      </Box>
    </div>
  );
};

export default ChatPage;
