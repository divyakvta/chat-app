import { Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast, Box } from '@chakra-ui/react';
import React, { useState } from 'react';
import { ChatState } from '../../Context/chatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';


function GroupChatModal({ children }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();
    const { user, chats, setChats } = ChatState();


    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
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
            setSearchResults(data);
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

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
            return;
        }

        try {
            
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post(`http://localhost:7000/api/chat/group`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                config
            );

            setChats([data, ...chats]);
            onClose();
            toast({
                title: "New group chat created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
        } catch (error) {
            toast({
                title: "Failed to create the chat!",
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
        }
    };

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader 
                        fontSize="35px" 
                        fontFamily="Work sans" 
                        display="flex" 
                        justifyContent="center"
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" alignItems="center">
                        <FormControl mb={3}>
                            <Input 
                                placeholder="Chat name" 
                                onChange={(e) => setGroupChatName(e.target.value)} 
                            />
                        </FormControl>
                        <FormControl mb={1}>
                            <Input 
                                placeholder="Add users" 
                                onChange={(e) => handleSearch(e.target.value)} 
                            />
                        </FormControl>

                        <Box w="100%" display="flex" flexWrap="wrap">
                            {selectedUsers.map((u) => (
                                <UserBadgeItem 
                                    key={user._id} 
                                    user={u} 
                                    handleFunction={() => handleDelete(u)} 
                                />
                            ))}
                        </Box>

                        {loading ? <div>Loading...</div> : (
                            searchResults?.slice(0, 4).map((user) => (
                                <UserListItem 
                                    key={user._id} 
                                    user={user} 
                                    handleFunction={() => handleGroup(user)} 
                                />
                            ))
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default GroupChatModal;
