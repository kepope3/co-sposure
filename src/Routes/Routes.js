import React, { Component } from "reactn";
import { Route, Redirect } from "react-router-dom";
import {
  SIGN_IN,
  SIGN_UP,
  SPRINTS,
  ADMIN,
  ABOUT,
  LANDING,
  PASSWORD_FORGET
} from "./../Constants/Routes";
import SignUpPage from "../Components/SignUp/SignUp";
import SignInPage from "../Components/SignIn/SignIn";
import About from "./../Components/About/About";
import Sprints from "../Components/Sprints/Sprints";
import Admin from "./../Components/Admin/Admin";
import Landing from "../Components/Landing/Landing";
import ForgottenPassord from "./../Components/ForgottenPassword/ForgottenPassord";

const NotFoundRedirect = () => <Redirect to={LANDING} />;
const LoggedInNotFoundRedirect = () => <Redirect to={SPRINTS} />;

const loggedOutRoutes = (
  <React.Fragment>
    <Route path={SIGN_IN} component={SignInPage} />
    <Route path={SIGN_UP} component={SignUpPage} />
    <Route path={LANDING} component={Landing} />
    <Route path={PASSWORD_FORGET} component={ForgottenPassord} />
    <Route component={NotFoundRedirect} />
  </React.Fragment>
);

const loggedInRoutes = (
  <React.Fragment>
    <Route path={ABOUT} component={About} />
    <Route path={SPRINTS} component={Sprints} />
    <Route path={ADMIN} component={Admin} />
    <Route component={LoggedInNotFoundRedirect} />
  </React.Fragment>
);

export default class extends Component {
  render() {
    return (
      <div>{this.props.isLoggedIn ? loggedInRoutes : loggedOutRoutes}</div>
    );
  }
}
