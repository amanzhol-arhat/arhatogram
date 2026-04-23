import React from "react";
import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ProtectedRoute from "./routers/ ProtectedRoute";
import Registration from "./pages/registration";
import Login from "./pages/Login"
import SinglePost from "./pages/SinglePost";
import Profile from "../src/pages/Profile"
import EditProfile from "./pages/EditProfile";
import ConversationList from "./component/chat/ConversationList.jsx";
import Chat from "./component/chat/Chat.jsx";
import Inbox from "./pages/Inbox.jsx";

function App(){
  return(
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route
        path="/post/:postId/"
        element={
          <ProtectedRoute>
            <SinglePost />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:profileId/"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:profileId/edit/"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inbox/"
        element={
          <ProtectedRoute>
            <Inbox />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inbox/:conversationId/"
        element={
          <ProtectedRoute>
            <Inbox />
          </ProtectedRoute>
        }
      />
      <Route path="/login/" element={<Login />} />
      <Route path="/register/" element={<Registration />} />
    </Routes>
  );
}

export default App;
