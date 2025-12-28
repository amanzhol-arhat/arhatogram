import { render, screen } from "../../../helpers/test-utils";
import userEvent from "@testing-library/user-event";
import RegistrationForm from "../RegistrationForm";
import userFixtures from "../../../helpers/fixtures/user";

const userData = userFixtures();

test("renders Registration form and allows typing", async () => {
  render(<RegistrationForm />);

  // form
  const form = document.querySelector("#registration-form");
  expect(form).toBeInTheDocument();

  // поля находим по label (react-bootstrap + Form.Label)
  const firstNameField = screen.getByLabelText(/first name/i);
  const lastNameField = screen.getByLabelText(/last name/i);
  const usernameField = screen.getByLabelText(/username/i);
  const emailField = screen.getByLabelText(/email address/i);
  const passwordField = screen.getByLabelText(/^password$/i);
  const bioField = screen.getByLabelText(/bio/i);

  await userEvent.type(firstNameField, userData.first_name);
  await userEvent.type(lastNameField, userData.last_name);
  await userEvent.type(usernameField, userData.username);
  await userEvent.type(emailField, userData.email);
  await userEvent.type(passwordField, "test-password-123"); // minLength=8
  await userEvent.type(bioField, userData.bio);

  expect(firstNameField).toHaveValue(userData.first_name);
  expect(lastNameField).toHaveValue(userData.last_name);
  expect(usernameField).toHaveValue(userData.username);
  expect(emailField).toHaveValue(userData.email);
  expect(passwordField).toHaveValue("test-password-123");
  expect(bioField).toHaveValue(userData.bio);
});
