import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function Login() {

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const history = useHistory()
  const toast = useToast()

  const handleClick = () => setShow(!show);
  

  const submitHandler = async () => {
    setLoading(true);
    if(!email || !password) {
      toast({
        title: "Please enter email and password",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }

    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:7000/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "User login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push('/chat')
    }catch(error) {

      const errorMessage = error.response && error.response.data && error.response.data.message
      ? error.response.data.message
      : "An unexpected error occurred";

      toast({
        title: "Error occurred",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }
  };

  return (
    <div>
  <VStack spacing="5px">
    <FormControl id="login-email" isRequired>
      <FormLabel>Email</FormLabel>
      <Input
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </FormControl>

    <FormControl id="login-password" isRequired>
      <FormLabel>Password</FormLabel>
      <InputGroup>
        <Input
          type={show ? "text" : "password"}
          placeholder="Enter a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleClick}>
            {show ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>

    <Button
      colorScheme="blue"
      width="100%"
      style={{ marginTop: 15 }}
      onClick={submitHandler}
      isLoading={loading}
    >
      Login
    </Button>

    <Button
      variant="solid"
      colorScheme="red"
      width="100%"
      onClick={() => {
        setEmail("guest@example.com");
        setPassword("guest123");
      }}
    >
      Get Guest User Credentials
    </Button>
  </VStack>
</div>

  )
}

export default Login
