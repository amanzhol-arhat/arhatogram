import React, { useState, useContext } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axiosService from "../../helpers/axios";
import useUserActions from "../../hooks/user.actions";
import { Context } from "../Layout";

function CreatePost(props) {
  const { refresh } = props;

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [validated, setValidated] = useState(false);
  const [form, setForm] = useState({});
  const { getUser } = useUserActions();

  const user = getUser();

  const { setToaster } = useContext(Context);

  const showToast = (message, type) => {
    setToaster({
      title: "Post!",
      message,
      type,
      show: true,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const createPostForm = event.currentTarget;
    if (createPostForm.checkValidity() === false) {
      event.stopPropagation();
    }
    setValidated(true);
    const data = {
      author: user.id,
      body: form.body,
    };
    axiosService
      .post("/post/", data)
      .then(() => {
        handleClose();
        setForm({});
        showToast("Post created 🚀", "success");
        refresh();
      })
      .catch(() => {
        showToast("An error occurred.", "danger");
      });
  };

  return (
    <>
      <Form.Group className="my-3 w-75">
        <Form.Control
          className="py-2 rounded-pill border-primary text-primary"
          data-testid="show-modal-form"
          type="text"
          placeholder="Write a post"
          onClick={handleShow}

        />
      </Form.Group>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>Create Post</Modal.Title>
        </Modal.Header>
        <Modal.Body className="border-0">
          <Form noValidate validated={validated}
                onSubmit={handleSubmit}
                data-testid="create-post-form">
            <Form.Group className="mb-3">
              <Form.Control
                name="body"
                data-testid="post-body-field"
                value={form.body || ""}   // чтобы не было undefined
                onChange={(e) =>
                  setForm({
                    ...form,
                    body: e.target.value,
                  })
                }
                as="textarea"
                rows={3}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!form.body}
            data-testid="create-post-submit"
          >
            Post
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreatePost;
