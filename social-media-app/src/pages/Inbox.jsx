import React from "react";
import NavigationBar from "../component/Navbar.jsx";
import ConversationList from "../component/chat/ConversationList";
import Chat from "../component/chat/Chat";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";

function Inbox() {
  const { conversationId } = useParams();

  return (
    <>
      <NavigationBar />
      <Container fluid className="mt-3">
        <Row>
          <Col md={4} className="border-end" style={{ height: "85vh", overflowY: "auto" }}>
            <ConversationList />
          </Col>
          
          <Col md={8} style={{ height: "85vh" }}>
            {conversationId ? <Chat /> : (
              <div className="d-flex h-100 align-items-center justify-content-center text-muted">
                Select chat to start messaging!
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Inbox;