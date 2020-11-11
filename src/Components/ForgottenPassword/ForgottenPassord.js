import React, { Component } from "reactn";
import { Jumbotron } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PASSWORD_FORGET } from "../../Constants/Routes";
import { setGlobalObject } from "./../../Helpers/global";
import { SIGN_IN } from "./../../Constants/Routes";

const INITIAL_STATE = {
  email: "",
  error: null
};

export default class ForgottenPassord extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = event => {
    event.preventDefault();

    setGlobalObject("account", "isLoading", true);

    this.global.firebase
      .doSendResetPasswordEmail(this.state.email)
      .then(() => {
        this.props.history.push(SIGN_IN);
        setGlobalObject("account", "isLoading", false);
      })
      .catch(error => {
        this.setState({ error });
        setGlobalObject("account", "isLoading", false);
      });
  };

  render() {
    const { email, error } = this.state;

    const isInvalid = email === "";

    return (
      <React.Fragment>
        <h1>Reset Password</h1>
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
            </div>
            {error && <p className="alert alert-danger">{error.message}</p>}
            <button
              className="btn btn-primary"
              disabled={isInvalid}
              type="submit"
            >
              Reset password
            </button>
            <p style={{ marginTop: "5px" }}>
              Submit your account email address to retrieve a reset password
              email
            </p>
          </form>
        </Jumbotron>
      </React.Fragment>
    );
  }
}

export const ForggotenPwLink = () => (
  <p>
    Forgotten your password? <Link to={PASSWORD_FORGET}>Reset Password</Link>
  </p>
);
