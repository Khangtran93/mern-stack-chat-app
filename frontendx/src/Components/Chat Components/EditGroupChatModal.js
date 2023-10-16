import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../Content/chatProvider";
import UserBadge from "../User/UserBadge";
import axios from "axios";
import UserListItem from "../User/UserListItem";

const EditGroupChat = ({ refetch, setRefetch }) => {
  const { selectedChat, setSelectedChat, user } = ChatState();
  const toast = useToast();

  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [renameLoading, setRenameLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRename = async () => {
    if (!groupChatName) {
      return;
    } else {
      try {
        setRenameLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.put(
          "/api/chat/rename",
          {
            chatId: selectedChat._id,
            chatName: groupChatName,
          },
          config
        );
        toast({
          title: "Group Chat Name Updated!",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setSelectedChat(data);
        setRefetch(!refetch);
        setRenameLoading(false);
      } catch (err) {
        toast({
          title: "Error Renaming Group Chat!",
          description: err.message,
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setRenameLoading(false);
      }
    }
  };

  const handleRemove = async (userToRemove) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToRemove._id !== user._id
    ) {
      toast({
        title: "Only admin can remove user!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        config
      );
      userToRemove._id === user._id
        ? toast({
            title: "You've left the group",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          })
        : toast({
            title: "User removed!",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
      userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setLoading(false);
      setRefetch(!refetch);
    } catch (error) {
      toast({
        title: "Error removing user!",
        status: "warning",
        description: error.message,
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);

      setSearchResults(data);
    } catch (err) {
      toast({
        title: "Error Occured",
        status: "warning",
        duration: 5000,
        position: "bottom-left",
        isClosable: true,
      });
    }
  };

  const addToGroup = async (userToAdd) => {
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admin can add group members!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast({
        title: "User already in the group",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );
      toast({
        title: "user added!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      console.log(data);
      console.log("SelectedChat", selectedChat);
      setSelectedChat(data);
      setRefetch(!refetch);
    } catch (error) {
      toast({
        title: "Error adding new user!",
        description: error.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            justifyContent="center"
            display="flex"
          >
            {selectedChat.chatName.toUpperCase()}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" flexWrap="wrap">
              {selectedChat.users.map((user) => (
                <UserBadge
                  key={user._id}
                  user={user}
                  handleFunction={() => handleRemove(user)}
                ></UserBadge>
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                value={groupChatName}
                placeholder="Rename Group"
                mr={2}
                my={2}
                onChange={(e) => setGroupChatName(e.target.value)}
              ></Input>
              <Button
                variant="solid"
                colorScheme="teal"
                my={2}
                onClick={() => handleRename()}
              >
                Update
              </Button>
            </FormControl>

            <FormControl display="flex">
              <Input
                value={search}
                placeholder="Add New User"
                mr={2}
                my={2}
                w="80%"
                onChange={(e) => handleSearch(e.target.value)}
              ></Input>
            </FormControl>
            {loading && <Spinner mt={2} />}
            {renameLoading && <Spinner mt={2} />}
            {searchResults &&
              searchResults
                .slice(0, 4)
                .map((result) => (
                  <UserListItem
                    key={result._id}
                    user={result}
                    handleFunction={() => addToGroup(result)}
                  />
                ))}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost" bg="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default EditGroupChat;
