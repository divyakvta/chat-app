import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/chatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import "./style.css"
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import  Lottie  from 'react-lottie';
import animationData from '../animations/typing.json'


const ENDPOINT = "http://localhost:7000";
let socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState()
   const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
   const [socketConnected, setSocketconnected] = useState(false);
   const [typing, setTyping] = useState(false);
   const [isTyping, setIsTyping] = useState(false)

   const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSetting: {
        preserveAspectRatio: "xMidYMid slice",
    },
   }

   const toast = useToast()

   const fetchMessages = async() => {
    if(!selectedChat) return;

    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}` 
            }
        };

        setLoading(true);
        const { data } = await axios.get(`http://localhost:7000/api/message/getMessage/${selectedChat._id}`, config);
        console.log(messages)
        setMessages(data);
        setLoading(false)

        socket.emit('join chat', selectedChat._id) 
        console.log(selectedChat._id)
    }catch(error) {
        toast({ 
            title: "Error Occured",
            description: "Failed to load the message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        });
    }
   }

   useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket .on('connected', () => setSocketconnected(true));
    socket.on('typing', () => setIsTyping(true))
    socket.on('stop typing', () => setIsTyping(false))
}, [])

   useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
   }, [selectedChat]);

   useEffect(() => {
    socket.on('message recieved', (newMessageRecieved) => {
        if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
            if(!notification.includes(newMessageRecieved)) {
                setNotification([newMessageRecieved, ...notification]);
                setFetchAgain(!fetchAgain);
            }
        }else {
            setMessages([...messages, newMessageRecieved]);
        }

    })
   })

   const sendMessage = async(e) => {
    if (e.key === "Enter" && newMessage) {
        socket.emit("stop typing", selectedChat._id);
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}` 
                }
            };
            
            setNewMessage("");
            const {data} = await axios.post("http://localhost:7000/api/message/",
                {
                    content: newMessage,
                    chatId: selectedChat._id
               },config);
               console.log(data)

               socket.emit('new message', data)
               setMessages([...messages, data])
            
        } catch (error) {
            toast({ 
                title: "Error Occured",
                description: "Failed to send the message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        }
    }
};



   const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if(!socketConnected) return;

        if(!typing) {
            setTyping(true)
            socket.emit('typing', selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if(timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
   };


  return (
    <>
   {selectedChat ? (
    <>
    <Text 
    fontSize={{ base: "28px", md: "30px" }}
    pb={3}
    px={2}
    width="100%"
    fontFamily="Work sans"
    display="flex"
    justifyContent={{ base: "space-between" }}
    alignItems="center"
    >
        <IconButton display={{ base: "flex", md: "none"}}
        icon={<ArrowBackIcon/>}
        onClick={() => setSelectedChat("")}
        />
        {!selectedChat.isGroupChat ? (
            <>
            {getSender(user, selectedChat.users)}
            <ProfileModal user={getSenderFull(user, selectedChat.users)}/>
            </>
        ) : (
            <>
            {selectedChat.chatName.toUpperCase()}
            <UpdateGroupChatModal
            fetchAgain = {fetchAgain}
            setFetchAgain={setFetchAgain}
            fetchMessages = {fetchMessages}
            />
            </>
        )}
    </Text>
    <Box 
    display="flex"
    flexDir="column"
    justifyContent="flex-end"
    p={3}
    bg="#E8E8E8"
    width="100%"
    height="100%"
    borderRadius="lg"
    overflow="hidden"
    >
        {loading ? (
            <Spinner 
            size="xl" 
            width={20}
            height={20}
            alignSelf="center"
            margin="auto" 
            />
        ) : (
            <div className='messages'>
                <ScrollableChat messages={messages} />
            </div>       
            )}
        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
            {isTyping ? ( 
                <div>
                <Lottie
                options={defaultOptions}
                width={70}
                style={{ marginBottom: 15, marginLeft: 0 }}
                 />
            </div> ) : (
                <></>)}
            <Input 
            variant="filled"
            bg="#E0E0E0"
            placeholder='Enter the message..'
            onChange={typingHandler} 
            value={newMessage}/>
        </FormControl>
    </Box>
     </>
   ) : (
    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on user to start
        </Text>
    </Box>
   )}
    </>
  )
}

export default SingleChat
