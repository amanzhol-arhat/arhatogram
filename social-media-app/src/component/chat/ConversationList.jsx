import React, { useState, useEffect } from "react";
import { ListGroup, Image, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosService from "../../helpers/axios";
import { format } from "timeago.js";

const ConversationList = () => {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosService
      .get("/chats/")
      .then((res) => setConversations(res.data.results))
      .catch((err) => console.error("Error fetching chats:", err));
  }, []);

  return (
    <Card className="mx-auto mt-4" style={{ maxWidth: "600px" }}>
      <Card.Header className="fw-bold fs-4">Messages</Card.Header>
      <ListGroup variant="flush">
        {conversations.length > 0 ? (
          conversations.map((chat) => (
            <ListGroup.Item
              key={chat.id}
              action
              onClick={() => navigate(`/inbox/${chat.id}/`)}
              className="d-flex justify-content-between align-items-center p-3"
            >
              <div className="d-flex align-items-center">
                <Image
                  src={chat.other_user?.avatar}
                  roundedCircle
                  width={50}
                  height={50}
                  className="me-3 border"
                />
                <div>
                  <div className="fw-bold">{chat.other_user?.username}</div>
                  <div className="text-muted small text-truncate" style={{ maxWidth: "250px" }}>
                    {chat.last_message?.body || "No messages yet..."}
                  </div>
                </div>
              </div>
              <small className="text-muted">
                {chat.last_message && format(chat.last_message.created)}
              </small>
            </ListGroup.Item>
          ))
        ) : (
          <div className="p-5 text-center text-muted">No conversations yet.</div>
        )}
      </ListGroup>
    </Card>
  );
};

export default ConversationList;