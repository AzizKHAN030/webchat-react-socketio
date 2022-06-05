import React from "react";
import socket from "./socket";
import axios from "axios";
import { Row, Col } from "antd";

import "./index.scss";

import Auth from "./components/Auth";
import Chat from "./components/Chat";
import reducer from "./reducer";

function App() {
  const [state, dispatch] = React.useReducer(reducer, {
    isAuth: false,
    roomId: null,
    userName: null,
    users: [],
    messages: [],
  });

  const setUsers = (users) => {
    dispatch({
      type: "SET_USERS",
      payload: users,
    });
  };
  const addMessage = (message) => {
    dispatch({
      type: "NEW_MESSAGE",
      payload: message,
    });
  };

  React.useEffect(() => {
    socket.on("ROOM_SET_USERS", setUsers);
    socket.on("ROOM_NEW_MESSAGE", addMessage);
  }, []);
  const onLogin = async (obj) => {
    socket.emit("ROOM_JOIN", obj);
    console.log(obj.roomId);
    const { data } = await axios.get(`/rooms/${obj.roomId}`);

    dispatch({
      type: "IS_AUTH",
      payload: obj,
    });

    dispatch({
      type: "SET_DATA",
      payload: data,
    });
  };

  return (
    <div className="app">
      <Row className="app__wrapper" justify="center" align="middle">
        <Col className="app__chat" span={22}>
          {!state.isAuth ? (
            <Auth onLogin={onLogin} />
          ) : (
            <Chat {...state} onAddMessage={addMessage} />
          )}
        </Col>
      </Row>
    </div>
  );
}

export default App;
