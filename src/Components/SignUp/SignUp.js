import React, { Component } from "reactn";
import { Link, withRouter } from "react-router-dom";
import { SIGN_UP, ABOUT } from "../../Constants/Routes";
import { setGlobalObject } from "./../../Helpers/global";
import { Jumbotron } from "react-bootstrap";
import { TakeALook } from "../Landing/Landing";

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
    <TakeALook />
  </div>
);

const INITIAL_STATE = {
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    event.preventDefault();

    const { email, passwordOne } = this.state;

    setGlobalObject("account", "isLoading", true);
    this.global.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });

        this.global.firebase.auth.currentUser
          .sendEmailVerification()
          .then(() => {
            setGlobalObject("account", "isLoading", false);
            this.props.history.push(ABOUT);
          })
          .catch(err => {
            setGlobalObject("account", "isLoading", false);
          });
      })
      .catch(error => {
        this.setState({ error });
        setGlobalObject("account", "isLoading", false);
      });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, passwordOne, passwordTwo, error } = this.state;
    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === "" || email === "";
    return (
      <Jumbotron>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <input
              onChange={this.onChange}
              name="email"
              placeholder="Email Address"
              type="email"
              value={email}
              className="form-control"
            />
            <input
              onChange={this.onChange}
              name="passwordOne"
              placeholder="Password"
              type="Password"
              value={passwordOne}
              className="form-control"
            />
            <input
              onChange={this.onChange}
              name="passwordTwo"
              placeholder="Password"
              type="Password"
              value={passwordTwo}
              className="form-control"
            />
          </div>
          {error && <p className="alert alert-danger">{error.message}</p>}
          <button
            className="btn btn-primary"
            disabled={isInvalid}
            type="submit"
          >
            Sign Up
          </button>
        </form>
      </Jumbotron>
    );
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = withRouter(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
