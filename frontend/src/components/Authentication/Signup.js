import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function Signup() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pic, setPic] = useState('');
  const [loading, setLoading] = useState(false)

  const history = useHistory()
  const toast = useToast()

  const handleClick = () => setShow(!show);


 const submitHandler = async () => {
  setLoading(true);

  if (!name || !email || !password || !confirmPassword) {
    toast({
      title: "Please Fill all the fields",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: 'bottom',
    });
    setLoading(false);
    return;
  }

  if (password !== confirmPassword) {
    toast({
      title: "Passwords do not match",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: 'bottom',
    });
    return;
  }

  try {
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };

    const { data } = await axios.post(
      "http://localhost:7000/api/user/register",
      { name, email, password, pic },
      config
    );

    toast({
      title: "Registration Successful",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: 'bottom',
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
    setLoading(false);
    history.push("/");
  } catch (error) {
    setLoading(false);
    
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
    setLoading(false);
  }
};

const postDetails = (pics) => {
  setLoading(true);
  if(pics === undefined) {
    toast({
      title: "Please select an image",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: 'bottom',
    });
    return;
  }
  if( pics.type === "image/jpeg" || pics.type === "image/png") {
    const data = new FormData();
    data.append('file', pics);
    data.append("upload_preset", "chat-app");
    data.append("cloud_name", 'dw3zk6gub');
    fetch("https://api.cloudinary.com/v1_1/dw3zk6gub/image/upload", {
      method: "post",
      body: data,
    })
    .then((res) => res.json())
    .then((data) => {
      setPic(data.url.toString())
      setLoading(false)
    })
    .catch((err) => {
      console.log(err)
      setLoading(false)
    });
  }else {
    toast({
      title: "Please select an image",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: 'bottom',
    })
  }
}

  return (
    <VStack spacing="5px">
  <FormControl id="signup-name" isRequired>
    <FormLabel>Name</FormLabel>
    <Input
      placeholder="Enter your name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  </FormControl>

  <FormControl id="signup-email" isRequired>
    <FormLabel>Email</FormLabel>
    <Input
      placeholder="Enter your email address"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  </FormControl>

  <FormControl id="signup-password" isRequired>
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

  <FormControl id="signup-confirm-password" isRequired>
    <FormLabel>Confirm Password</FormLabel>
    <InputGroup>
      <Input
        type={show ? "text" : "password"}
        placeholder="Re-enter your password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {show ? "Hide" : "Show"}
        </Button>
      </InputRightElement>
    </InputGroup>
  </FormControl>

  <FormControl id="signup-pic">
    <FormLabel>Upload your profile picture</FormLabel>
    <Input
      type="file"
      p={1.5}
      accept="image/*"
      onChange={(e) => postDetails(e.target.files[0])}
    />
  </FormControl>

  <Button
    colorScheme="blue"
    width="100%"
    style={{ marginTop: 15 }}
    onClick={submitHandler}
    isLoading={loading}
  >
    Sign Up
  </Button>
</VStack>
  );
}

export default Signup;
