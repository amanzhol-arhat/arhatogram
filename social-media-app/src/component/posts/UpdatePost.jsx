import React, { useState, useContext } from "react";
import { Button, Modal, Form, Dropdown } from "react-bootstrap";
import axiosService from "../../helpers/axios";
import { Context } from "../Layout";


function UpdatePost(props) {
  const { post, refresh } = props;
  const { setToaster } = useContext(Context);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setForm({ body: post.body });
    setValidated(false);
    setShow(true);
  };

  const [validated, setValidated] = useState(false);
  const [form, setForm] = useState({ body: post.body });

  const showToast = (message, type) => {
    setToaster({
      title: "Post",
      message,
      type,
      show: true,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatePostForm = event.currentTarget;
    if (updatePostForm.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);

    const data = {
      body: form.body,
    };

    axiosService
      .patch(`/post/${post.id}/`, data)
      .then(() => {
        handleClose();
        showToast("Post updated", "success");
        if (refresh) {
          refresh();
        }
      })
      .catch(() => {
        showToast("An error occurred.", "danger");
      });
  };

  return (
    <>
      <Dropdown.Item onClick={handleShow}
                     data-testid="show-modal-form"
      >Modify</Dropdown.Item>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>Update Post</Modal.Title>
        </Modal.Header>
        <Modal.Body className="border-0">
          <Form noValidate validated={validated}
                onSubmit={handleSubmit}
                data-testid="update-post-form"
          >
            <Form.Group className="mb-3">
              <Form.Control
                name="body"
                value={form.body || ""}
                data-testid="post-body-field"
                onChange={(e) =>
                  setForm({
                    ...form,
                    body: e.target.value,
                  })
                }
                as="textarea"
                rows={3}
                required
              />
              <Form.Control.Feedback type="invalid">
                Post body is required.
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            data-testid="update-post-submit"
            variant="primary"
            onClick={handleSubmit}
            disabled={!form.body}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdatePost;
