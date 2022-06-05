import React from "react";
import axios from "axios";
import { Button, Form, Input } from "antd";

import "../socket";

export default function Auth({ onLogin }) {
  const [roomId, setRoomId] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const onEnter = async () => {
    if (roomId && userName) {
      setIsLoading(true);
      await axios.post("/rooms", { roomId, userName });
      onLogin({ roomId, userName });
    }
  };

  return (
    <Form
      name="basic"
      className="app__chat-auth"
      layout="vertical"
      autoComplete="off"
    >
      <Form.Item
        label="RoomID"
        name="roomId"
        rules={[
          {
            required: true,
            message: "Please input RoomID!",
          },
        ]}
      >
        <Input onChange={(e) => setRoomId(e.target.value)} />
      </Form.Item>

      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: "Please input username!",
          },
        ]}
      >
        <Input onChange={(e) => setUserName(e.target.value)} />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 0,
          span: 24,
        }}
      >
        <Button
          type="primary"
          loading={isLoading}
          htmlType="submit"
          onClick={onEnter}
        >
          Enter
        </Button>
      </Form.Item>
    </Form>
  );
}
