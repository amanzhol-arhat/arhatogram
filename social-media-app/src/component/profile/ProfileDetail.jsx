import React, { useState, useEffect } from "react";
import { Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useUserActions from "../../hooks/user.actions";
import axiosService from "../../helpers/axios";

const ProfileDetail = (props) => {
  const { profile } = props;
  const { getUser } = useUserActions();
  const loggedInUser = getUser();
  const navigate = useNavigate();

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    if (profile) {
      setIsFollowing(profile.is_following);
      setFollowersCount(profile.followers_count);
    }
  }, [profile]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  const { first_name, last_name, bio, posts_count, following_count, id, avatar } = profile;

  const handleFollowToggle = () => {
    const action = isFollowing ? "unfollow" : "follow"; 
    
    axiosService
      .post(`/users/${id}/${action}/`) 
      .then(() => {
        setIsFollowing(!isFollowing);
        setFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1);
      })
      .catch((err) => console.error("Error toggling follow status:", err));
  };

  const handleMessageClick = async () => {
    try {
      const res = await axiosService.post("/chats/", {
        user_public_id: id, 
      });
      
      const conversationId = res.data.id;
      navigate(`/inbox/${conversationId}/`);
    } catch (err) {
      console.error("Не удалось начать чат:", err);
      navigate("/inbox/");
    }
  };

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
          
          <p className="fs-6 text-muted mb-1 mt-1">
            <strong>{posts_count || 0}</strong> Posts &nbsp;|&nbsp; 
            <strong> {followersCount}</strong> Followers &nbsp;|&nbsp; 
            <strong> {following_count || 0}</strong> Following
          </p>
          
          <p className="fs-6 mt-2">
            <small>{bio || "(No bio.)"}</small>
          </p>
          
          <div className="d-flex flex-row gap-2 mt-2">

            {loggedInUser && loggedInUser.id === id && (
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => navigate(`/profile/${id}/edit/`)}
              >
                Edit Profile
              </Button>
            )}

            {loggedInUser && loggedInUser.id !== id && (
              <>
                <Button
                  variant={isFollowing ? "outline-primary" : "primary"}
                  size="sm"
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>

                <Button
              variant="outline-primary"
              size="sm"
              onClick={handleMessageClick}
            >
              <i className="bi bi-chat-right-text-fill me-2"></i>
              Message
            </Button>
              </>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;