import { CloseIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/react";
import React from "react";

const UserBadge = ({ user, handleFunction }) => {
  return (
    <Box
      bg="#0b9decce"
      m={1}
      px={2}
      py={1}
      borderRadius="lg"
      fontSize={12}
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.name}
      <CloseIcon pl={1} />
    </Box>
  );
};

export default UserBadge;
