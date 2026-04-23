import React from "react";
import { Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useUserActions from "../../hooks/user.actions";

const ProfileDetail = (props) => {
  const { profile } = props;
  const { getUser } = useUserActions();
  const loggedInUser = getUser();
  const navigate = useNavigate();

  if (!profile) {
    return <div>Loading...</div>;
  }

  const { first_name, last_name, bio, posts_count, id, avatar } = profile;

  return (
    <div>
      <div className="d-flex flex-row border-bottom p-5">
        <Image
          src={avatar}
          roundedCircle
          width={120}
          height={120}
          className="me-5 border border-primary border-2"
          style={{ objectFit: "cover" }}
        />
        <div className="d-flex flex-column justify-content-start align-self-center mt-2">
          <p className="fs-4 m-0">
            {first_name} {last_name}
          </p>
          <p className="fs-5"></p>
          <p className="fs-6">
            <small>{bio || "(No bio.)"}</small>
          </p>
          
          {/* Блок с кнопками */}
          <div className="d-flex flex-row gap-2 mt-2">
            {/* Кнопка "Edit" для своего профиля */}
            {loggedInUser && loggedInUser.id === id && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(`/profile/${id}/edit/`)}
              >
                Edit
              </Button>
            )}

            {loggedInUser && loggedInUser.id !== id && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(`/inbox/`)}
              >
                <i className="bi bi-chat-right-text-fill me-2"></i>
                Message
              </Button>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;