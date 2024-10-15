import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/chatProvider';
import axios from 'axios';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';

function MyChat({ fetchAgain }) {
    const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
    const toast = useToast();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get("http://localhost:7000/api/chat", config);
            console.log(data);
            setChats(data);
        } catch (error) {
            toast({
                title: "Error occurred!",
                description: "Failed to load chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) setLoggedUser(userInfo);
        fetchChats();
    }, [fetchAgain]);

    return (
        <div>
            <Box
                display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
                flexDir="column"
                alignItems="center"
                p={3}
                bg="white"
                borderRadius="lg"
                borderWidth="1px"
                height={{ base: "auto", md: "calc(100vh - 85px)" }}
                overflowY="hidden"
            >
                <Box
                    pb={3}
                    px={3}
                    fontSize={{ base: "17px", md: "28px" }}
                    fontFamily="Work sans"
                    display="flex"
                    width="100%"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={8}
                >
                    My Chats
                    <GroupChatModal>
                    <Button
                        display="flex"
                        fontSize={{ base: "15px", md: "10px", lg: "15px" }}
                        rightIcon={<AddIcon />}
                    >
                        New Group Chat
                    </Button>
                    </GroupChatModal>
                </Box>
                <Box
                    display="flex"
                    flexDir="column"
                    p={3}
                    bg="#F8F8F8"
                    width="100%"
                    height="100%" 
                    borderRadius="lg"
                    overflowY="scroll"
                    borderWidth="1px"
                >
                  {chats && chats.length > 0 ? (
    <Stack spacing={3}>
        {chats.map((chat) => (
            <Box
                key={chat._id} 
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                transition="background-color 0.2s ease"
                _hover={{ bg: selectedChat === chat ? "#2c9b9a" : "#d4d4d4" }}
            >
                <Text fontWeight="bold">
                    {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                </Text>
            </Box>
        ))}
    </Stack>
) : (
    <ChatLoading />
)}

                </Box>
            </Box>
        </div>
    );
}

export default MyChat;
