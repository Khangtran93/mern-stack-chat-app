import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../Content/chatProvider";
import axios from "axios";
import UserListItem from "../User/UserListItem";
import ChatLoader from "./ChatLoader";
import UserBadge from "../User/UserBadge";

const GroupChatModal = ({ children }) => {
  const { user, chats, setChats } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([user]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const addToGroup = (user) => {
    if (selectedUsers.includes(user)) {
      toast({
        title: "User already in the group",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleDelete = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
  };

  const handleSubmit = async () => {
    if (!selectedUsers || !groupChatName) {
      toast({
        title: "Please fill out all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } else {
      if (selectedUsers.length < 3) {
        toast({
          title: "Group chat must have more than three people",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } else {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };

          const { data } = await axios.post(
            "api/chat/group",
            {
              name: groupChatName,
              users: JSON.stringify(selectedUsers.map((u) => u._id)),
            },
            config
          );
          setChats([data, ...chats]);

          toast({
            title: "Group chat created successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setSearch("");
          setGroupChatName("");
          setSearchResults([]);
          setSelectedUsers([user]);
          onClose();
        } catch (error) {
          toast({
            title: "Error occured",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      }
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
  return (
    <>
      {children ? (
        <span onClick={onOpen}> {children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {children ? "Create New Group Chat" : "Edit Group Chat"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Chat Name</FormLabel>
              <Input
                placeholder="Enter Chat Name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Search Users</FormLabel>
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box display="flex" flexWrap="wrap" py={3}>
              {selectedUsers &&
                selectedUsers.map((u) => (
                  <UserBadge
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
            </Box>

            <Box overflowY="scroll" mt={3}>
              {loading ? (
                <ChatLoader />
              ) : (
                searchResults &&
                searchResults
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => addToGroup(user)}
                    />
                  ))
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
