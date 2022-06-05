import React from "react";

import { Col, Row, Badge, Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import socket from "../socket";

export default function Chat({
  users,
  messages,
  roomId,
  userName,
  onAddMessage,
}) {
  const [inputVal, setInputVal] = React.useState("");

  const messagesRef = React.useRef(null);

  const onSendMessage = () => {
    if (inputVal) {
      socket.emit("ROOM_NEW_MESSAGE", { userName, text: inputVal, roomId });
      onAddMessage({ userName, text: inputVal });
      setInputVal("");
    }
  };

  React.useEffect(() => {
    messagesRef.current.scrollTo(0, 9999);
  }, [messages]);

  return (
    <>
      <Row className="chat">
        <Col className="chat__users" span={6}>
          <h2>Room: {roomId}</h2>
          <Badge count={users.length} className="online" status="success">
            Online
          </Badge>
          <ul className="users">
            {users.map((user) =>
              user === userName ? (
                <li key={user} className="me">
                  You
                </li>
              ) : (
                <li key={user}>{user}</li>
              )
            )}
          </ul>
        </Col>
        <Col className="chat__messages" span={18}>
          <div className="messages" ref={messagesRef}>
            {messages.map((message) => (
              <div
                className={
                  message.userName === userName ? "message incoming" : "message"
                }
              >
                <p>{message.text}</p>
                <span>{message.userName}</span>
              </div>
            ))}
          </div>
          <div className="inputs">
            <Input
              placeholder="Type your message"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
              }}
              onKeyPress={(e) => {
                e.charCode === 13 && onSendMessage();
              }}
            />
            <Button
              onClick={onSendMessage}
              icon={<SendOutlined />}
              type="primary"
            ></Button>
          </div>
        </Col>
      </Row>
    </>
  );
}
