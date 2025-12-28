import React from "react";
import Layout from "../component/Layout";
import { Row, Col, Image } from "react-bootstrap";
import useSWR from "swr";
import { fetcher } from "../helpers/axios";
import useUserActions from "../hooks/user.actions";
import CreatePost from "../component/posts/CreatePost";
import ProfileCard from "../component/profile/ProfileCard"

import Post from "../component/posts/Post"

const Home = () => {
  const { getUser } = useUserActions();
  const { avatar } = getUser();
  const posts = useSWR("/post/", fetcher, {
    refreshInterval: 10000,
  });
  const profiles = useSWR("/users/?limit=5", fetcher, {
    refreshInterval: 10000,
  });
  const avatarSrc = avatar ?? "/default-avatar.png";

  let sortedPosts = [];
  if (posts.data?.results) {
    console.log("Original posts:", posts.data.results.map(p => p.created));
    sortedPosts = [...posts.data.results].sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );
  }

  return (
    <Layout>
      <Row className="justify-content-evenly">
        <Col sm={7}>
          <Row className="border rounded align-items-center">
            <Col className="flex-shrink-1">
              <Image
                src={avatarSrc}
                roundedCircle
                width={52}
                height={52}
                className="my-2"
              />
            </Col>
            <Col sm={10} className="flex-grow-1">
              <CreatePost refresh={posts.mutate} />
            </Col>
          </Row>
          <Row className="my-4">
            {posts.data?.results.map((post, index) => (
              <Col key={index} sm={12}>
                <Post post={post} refresh={posts.mutate} />
              </Col>
            ))}
          </Row>
        </Col>
            <Col sm={3} className="border rounded py-4 h-50">
              <h4 className="font-weight-bold text-center">
                Suggested people</h4>
              <div className="d-flex flex-column">
                {profiles.data &&
                  profiles.data.results.map((profile,
                                             index) => (
                    <ProfileCard key={index} user={profile}
                    />
                  ))}
              </div>
            </Col>
          </Row>
    </Layout>
);
}

export default Home;
