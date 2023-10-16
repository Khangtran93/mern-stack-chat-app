import React, { useState } from "react";
import {
  VStack,
  FormControl,
  Input,
  FormLabel,
  InputRightElement,
  Button,
  InputGroup,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please fill out all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        header: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
      toast({
        title: "Login successful",
        status: "success",
        position: "bottom",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);

      localStorage.setItem("userInfo", JSON.stringify(data));

      navigate("/chats");
    } catch (err) {
      toast({
        title: "Login error. Please try again",
        description: err.response.data.message,
        status: "error",
        duration: 5000,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing="4px">
      <FormControl isRequired id="email">
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl isRequired id="password">
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter a Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4rem">
            <Button
              h={"1.75rem"}
              size={"sm"}
              bg={"white"}
              onClick={handleClick}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button w={"100%"} colorScheme="blue" mt="6px" onClick={submitHandler}>
        Login
      </Button>

      <Button w={"100%"} colorScheme="red" mt="6px" onClick={submitHandler}>
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
