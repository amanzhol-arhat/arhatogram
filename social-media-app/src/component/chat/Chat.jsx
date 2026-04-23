import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Form, Button, Card } from "react-bootstrap";
import useUserActions from "../../hooks/user.actions";
import axiosService from "../../helpers/axios";

const Chat = () => {
  const { conversationId } = useParams();
  const { getUser } = useUserActions();
  const user = getUser();
  
  const [messageHistory, setMessageHistory] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    setMessageHistory([]);

    axiosService
      .get("/messages/", {
        params: { conversation_id: conversationId }
      })
      .then((res) => {
        setMessageHistory(res.data.results);
      })
      .catch((err) => console.error("Error loading message history:", err));
  }, [conversationId]); 

  //const socketUrl = `ws://localhost:8000/ws/chat/${conversationId}/`;
const tunnelHost = process.env.REACT_APP_WS_URL || "localhost:8000";
const socketUrl = `wss://${tunnelHost}/ws/chat/${conversationId}/`;
  
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log("Connected to WS! ✅"),
    shouldReconnect: () => true,
  });

  useEffect(() => {
    if (lastJsonMessage !== null) {
      setMessageHistory((prev) => [...prev, lastJsonMessage]);
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageHistory]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    sendJsonMessage({
      message: inputValue,
      sender_id: user.id,
    });
    setInputValue("");
  };

  return (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Body className="overflow-auto p-3 bg-light">
        <div className="d-flex flex-column gap-3">
          {messageHistory.map((msg, idx) => {
            const isMe = msg.sender?.id === user.id;
            
            return (
              <div
                key={msg.id || idx}
                className={`p-2 px-3 rounded-4 shadow-sm ${
                  isMe 
                    ? "bg-primary text-white align-self-end rounded-bottom-end-0" 
                    : "bg-white text-dark align-self-start rounded-bottom-start-0"
                }`}
                style={{ maxWidth: "80%" }}
              >
                {!isMe && (
                  <div className="fw-bold mb-1" style={{ fontSize: "0.7rem" }}>
                    {msg.sender?.username}
                  </div>
                )}
                <div>{msg.content}</div>
                <div 
                  className={`text-end mt-1 ${isMe ? "text-white-50" : "text-muted"}`} 
                  style={{ fontSize: "0.6rem" }}
                >
                  {msg.created_at && new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>
      </Card.Body>

      <Card.Footer className="bg-white border-0 p-3">
        <Form onSubmit={handleSendMessage} className="d-flex gap-2">
          <Form.Control
            placeholder="Write a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="rounded-pill"
          />
          <Button 
            type="submit" 
            variant="primary" 
            className="rounded-circle px-3"
            disabled={readyState !== ReadyState.OPEN}
          >
            <i className="bi bi-send-fill"></i>
          </Button>
        </Form>
      </Card.Footer>
    </Card>
  );
};

export default Chat;