import { Drawer, Grid, Skeleton } from "@mui/material";
import Title from "../shared/Title";
import Header from "./Header";
import ChatList from "../specific/ChatList";
import { samepleChats } from "../../constants/SampleData";
import { useNavigate, useParams } from "react-router-dom";
import Profile from "../specific/Profile";
import { useMyChatsQuery } from "../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { setIsDeleteMenu, setIsMobile, setSelectedDeleteChat } from "../../redux/reducers/misc";
import { useErrors } from "../../hooks/hooks";
import { getSocket } from "../../sockets";
import { useSocketEvents } from "6pp";
import { useCallback, useRef, useState } from "react";
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from "../../constants/events";
import { incrementNotification, setNewMessagesAlert } from "../../redux/reducers/chat";
import { useEffect } from "react";
import { getOrSaveFromStorage } from "../../lib/features";
import DeleteChatMenu from "../Dialogs/DeleteChatMenu";

const AppLayout = () => (WrappedComponent) => {

  return (props) => {
    const { chatId } = useParams();
    const dispatch=useDispatch();
    const navigate=useNavigate();
     const { newMessagesAlert } = useSelector((state) => state.chat);
       const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");
       const { isMobile } = useSelector((state) => state.misc);
           useErrors([{ isError, error }]);
       const handleMobileClose = () => dispatch(setIsMobile(false));
       
        const [onlineUsers, setOnlineUsers] = useState([]);

       const deleteMenuAnchor = useRef(null);
         useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

     

     const { user } = useSelector((state) => state.auth);
        const newMessageAlertListener = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId]
    );
    const refetchListener = useCallback(() => {
      refetch();
       navigate("/")
    }, [refetch,navigate]);

        const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, []);


    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);


     const socket = getSocket();

   
       const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
        [NEW_REQUEST]: newRequestListener,
        [REFETCH_CHATS]:refetchListener,
        [ONLINE_USERS]:onlineUsersListener
    };

    
    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    useSocketEvents(socket, eventHandlers);


    return (
      <>
        <Title />
        <Header sx={{ height: "4rem" }} />
        {/* Full height container */}
           <DeleteChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={deleteMenuAnchor}
        />
         {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer open={isMobile} onClose={handleMobileClose}>
            <ChatList
              w="70vw"
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
              onlineUsers={onlineUsers}
            />
          </Drawer>
        )}
        <Grid
          container
          height="calc(100vh - 4rem)" // subtracting header height
        >
          {/* Left Sidebar */}
          <Grid
            item
            sm={4}
            md={3}
            sx={{
              display: { xs: "none", sm: "block" },
              overflowY: "auto",
              height: "100%",
            }}
          >
             {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                 newMessagesAlert={newMessagesAlert}
            
              />
            )}
          </Grid>

          {/* Center (Chat Area) */}
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            lg={6}
            sx={{
              height: "100%",
              overflowY: "auto", // only this scrolls
            }}
          >
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </Grid>

          {/* Right Sidebar */}
          <Grid
            item
            md={4}
            lg={3}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem", // fixed typo
              bgcolor: "rgba(0,0,0,0.85)",
              color: "#fff",
              height: "100%",
              overflowY: "auto",
            }}
          >
            <Profile user={user}/>
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
