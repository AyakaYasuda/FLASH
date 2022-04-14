import React, { useContext, useState } from "react";
import { AuthContext } from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from "../util/validators";
import { useForm } from "../hooks/use-form";
import InputForm from "../components/FormElements/InputForm";
import Paper from "@mui/material/Paper";
import FormButton from "../components/FormElements/FormButton";
import PrimaryButton from "../components/UI/PrimaryButton";
import GoogleButton from "react-google-button";

const Auth = () => {
  const navigate = useNavigate();
  const { logIn, signUp, googleSignIn, dispatch, authUser } =
    useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState("");
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: { value: "", isValid: false },
      password: { value: "", isValid: false },
    },
    false
  );

  const logInHandler = async event => {
    event.preventDefault();
    setError("");
    try {
      await logIn(
        formState.inputs.email.value,
        formState.inputs.password.value
      );
      setIsLoginMode(true);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  const signUpHandler = async event => {
    event.preventDefault();
    setError("");
    try {
      await signUp(
        formState.inputs.email.value,
        formState.inputs.password.value,
        formState.inputs.username.value
      );

      if (authUser) {
        dispatch({
          type: "ADD_USER",
          payload: {
            username: formState.inputs.username.value,
            email: formState.inputs.email.value,
          },
        });
      } else {
        console.log("failed to add a user to db");
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const googleSignInHandler = async () => {
    setError("");
    try {
      await googleSignIn();
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  const modeChangeHandler = () => {
    setError("");
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          username: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          username: { value: "", isValid: false },
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  return (
    <div className="section-container center-col">
      <Paper sx={{ p: "2rem 1rem", width: "90%" }}>
        {isLoginMode ? <h1>Login Required</h1> : <h1>Sign Up</h1>}
        {error && <h2>{error}</h2>}
        <div>
          {!isLoginMode && (
            <InputForm
              id="username"
              label="User name"
              type="text"
              errorText="Username is required"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
            />
          )}
          <div className="spacer-sm" />
          <InputForm
            id="email"
            label="Email"
            type="email"
            errorText="Seems like invalid email"
            validators={[VALIDATOR_EMAIL()]}
            onInput={inputHandler}
          />
          <div className="spacer-sm" />
          <InputForm
            id="password"
            label="Password"
            type="password"
            errorText="Password should be min 6 letters"
            validators={[VALIDATOR_MINLENGTH(6)]}
            onInput={inputHandler}
          />
        </div>

        <div className="spacer-md" />

        {!isLoginMode ? (
          <FormButton onClick={signUpHandler} disabled={!formState.isValid}>
            SIGNUP
          </FormButton>
        ) : (
          <FormButton onClick={logInHandler} disabled={!formState.isValid}>
            LOGIN
          </FormButton>
        )}
      </Paper>

      <div className="spacer-md" />
      <p>Do you want to log in with your google account?</p>
      <GoogleButton type="light" onClick={googleSignInHandler} />

      <div className="spacer-md" />
      {isLoginMode ? (
        <>
          <p>You don't have an account?</p>
          <PrimaryButton onClick={modeChangeHandler}>SIGNUP</PrimaryButton>
        </>
      ) : (
        <>
          <p>You already have an account?</p>
          <PrimaryButton onClick={modeChangeHandler}>LOGIN</PrimaryButton>
        </>
      )}
    </div>
  );
};

export default Auth;
