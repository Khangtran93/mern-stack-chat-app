import React from "react";
import { Stack, Skeleton } from "@chakra-ui/react";

const ChatLoader = () => {
  return (
    <>
      <Stack style={{ visibility: "visible" }}>
        <Skeleton
          mt={2}
          height="30px"
          startColor="pink.500"
          endColor="orange.500"
        />
        <Skeleton mt={2} height="20px" />
        <Skeleton mt={2} height="20px" />
        <Skeleton mt={2} height="20px" />
        <Skeleton mt={2} height="20px" />
        <Skeleton mt={2} height="20px" />
      </Stack>
    </>
  );
};

export default ChatLoader;
