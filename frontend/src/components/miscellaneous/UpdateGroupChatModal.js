import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/chatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';

function UpdateGroupChatModal({ fetchAgain, setFetchAgain, fetchMessages }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false)
    const [renameloading, setReanameloading] = useState(false)
    const toast = useToast();

    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleAddUser = async(user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
              title: "User already in the group",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: 'bottom',
            });
            return;
          }
          if (selectedChat.groupAdmin._id !== user._id) {  
            toast({
              title: "Only admins can add users to the group.",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: 'bottom',
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

            const { data } = await axios.put("http://localhost:7000/api/chat/add-to-group", {
                chatId: selectedChat._id,
                userId: user1._id,
            },
        config
    );
    setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    setLoading(false);
        }catch (error) {
            toast({
                title: "An error occurred.",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
            setLoading(false)
        }

    }

    const handleRemove = async(user1) => {
        if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: "Only admins can remove someone!.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            return
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put("http://localhost:7000/api/chat/remove-from-group", {
                chatId: selectedChat._id,
                userId: user1._id,
            },
        config
    );

    user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    fetchMessages();
    setLoading(false);
        }catch (error) {
            toast({
                title: "An error occurred.",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
            setLoading(false)
        }
    }

    const handleRename = async() => {
        if(!groupChatName) return;

        try {
            setReanameloading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put('http://localhost:7000/api/chat/rename-group', {
                chatId: selectedChat._id,
                chatName: groupChatName
            },
            config
         );

         setSelectedChat(data);
         setFetchAgain(!fetchAgain);
         setReanameloading(false)
        }catch (error) {
         toast({
            title: "error occured",
            description: error.resonse.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
         });
         setReanameloading(false);
        }
        setGroupChatName('')
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`http://localhost:7000/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            setLoading(false);
            toast({
                title: "An error occurred.",
                description: "Unable to complete search.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
        }
    };
    



    return (
        <>
          <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
                fontSize="20px"
                fontFamily="Work sans"
                display="flex"
                justifyContent="center"
              >
                {selectedChat.chatName}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box width="100%" display="flex" flexWrap="wrap" pb={3}>
                  {selectedChat.users.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      handleFunction={() => handleRemove(u)}
                    />
                  ))}
                </Box>
      
                <FormControl display="flex" alignItems="center" mb={3}>
                  <Input
                    placeholder="Chat Name"
                    value={groupChatName}
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                  <Button
                    variant="solid"
                    colorScheme="teal"
                    ml={2}
                    isLoading={renameloading}
                    onClick={handleRename}
                  >
                    Update
                  </Button>
                </FormControl>
                <FormControl>
                    <Input
                    placeholder='Add user to group'
                    mb={1}
                    onChange={(e) => handleSearch(e.target.value)}
                    />
                </FormControl>
                {loading ? (
                    <Spinner size="lg" />
                ) : (
                    searchResult?.map((user) => (
                        <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handleAddUser(user)}
                        />
                    ))
                )}
              </ModalBody>

              <ModalFooter>
                <Button onClick={() => handleRemove(user)} colorScheme='red'>
                  Leave Group
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      );
      
}

export default UpdateGroupChatModal
