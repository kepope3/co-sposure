import React, { Component } from "reactn";
import { withRouter } from "react-router-dom";
import { SPRINTS } from "../../Constants/Routes";
import { SignUpLink } from "../SignUp/SignUp";
import { Jumbotron } from "react-bootstrap";
import { ForggotenPwLink } from "../ForgottenPassword/ForgottenPassord";
import { setGlobalObject } from "../../Helpers/global";

const SignInPage = () => (
  <div>
    <h1>SignIn</h1>
    <SignInForm />
    <ForggotenPwLink />
    <SignUpLink />
  </div>
);

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    event.preventDefault();
    const { email, password } = this.state;

    setGlobalObject("account", "isLoading", true);
    this.global.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        setGlobalObject("account", "isLoading", false);
        this.setState({ ...INITIAL_STATE });

        this.props.history.push(SPRINTS);
      })
      .catch(error => {
        setGlobalObject("account", "isLoading", false);

        this.setState({ error });
      });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === "" || email === "";

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
              name="password"
              placeholder="Password"
              type="password"
              value={password}
              className="form-control"
            />
          </div>
          {error && <p className="alert alert-danger">{error.message}</p>}
          <button
            className="btn btn-primary"
            disabled={isInvalid}
            type="submit"
          >
            Sign In
          </button>
        </form>
      </Jumbotron>
    );
  }
}

const SignInForm = withRouter(SignInFormBase);

export default SignInPage;

export { SignInForm };
