import React, { useState } from 'react';
import { ChatState } from '../Context/chatProvider'; // Ensure this is imported correctly
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChat from '../components/MyChat';
import ChatBox from '../components/ChatBox';

function Chatpage() {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: '100%' }}>
      {user && <SideDrawer />}
      <Box display="flex" justifyContent="space-between" width="100%" p={3}>
        {user && <MyChat fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
}

export default Chatpage;
