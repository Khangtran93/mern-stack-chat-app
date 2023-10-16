import React, { useEffect, useState } from "react";
import { ChatState } from "../../Content/chatProvider";
import {
  Tooltip,
  Box,
  Button,
  Text,
  Menu,
  MenuButton,
  Avatar,
  MenuItem,
  MenuList,
  MenuDivider,
  useDisclosure,
  Drawer,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  Input,
  useToast,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import { ChevronDownIcon, BellIcon } from "@chakra-ui/icons";
import { GoSearch } from "react-icons/go";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import ChatLoader from "./ChatLoader";
import axios from "axios";
import UserListItem from "../User/UserListItem";
import { getSender } from "../../config/ChatLogic";

const SideBar = () => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setSelectedChat("");
    setChats([]);
    navigate("/");
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);
      //if the returned data that represent selectedChat is not in the chat, append it to the chats State
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
    } catch (err) {
      toast({
        title: "Something went wrong",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please provide name or email",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
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
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
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
      <Box
        display="flex"
        bg="white"
        borderWidth="5px"
        justifyContent="space-between"
        alignItems="center"
      >
        <Tooltip
          label="Search for users to chat"
          hasArrow
          placement="bottom-end"
        >
          <Button m={1} onClick={onOpen}>
            <Text display={{ base: "none", md: "flex" }} px="2">
              Search Users
            </Text>
            <GoSearch style={{ marginTop: "2px" }} />
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
          ChatHub
        </Text>

        <div>
          <Menu>
            <MenuButton m="2">
              {notification.length > 0 && (
                <Badge borderRadius="80%" colorScheme="red" variant="solid">
                  {notification.length}
                </Badge>
              )}
              <BellIcon fontSize="2xl" />
            </MenuButton>
            <MenuList px={2}>
              {!notification.length && "No New Message"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(
                      notification.filter((n) => n.chat._id !== notif.chat._id)
                    );
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                  {/* {selectedChat === notif.chat &&
                    notification.filter((n) => n !== notif)} */}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              m="1"
              //   hasArrow="disabled"
              as={Button}
              leftIcon={<ChevronDownIcon />}
            >
              <Avatar
                cursor="pointer"
                size="sm"
                // name={user.name}
                src={user.profilePicture}
              />
            </MenuButton>

            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>Profile</MenuItem>
              </ProfileModal>

              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              ></Input>
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoader />
            ) : (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                ></UserListItem>
              ))
            )}
            {loadingChat && <Spinner />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideBar;
