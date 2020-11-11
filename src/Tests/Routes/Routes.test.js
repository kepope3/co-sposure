import { shallow } from "enzyme";
import React from "react";
import {
  SIGN_IN,
  SIGN_UP,
  SPRINTS,
  ADMIN,
  ABOUT,
  LANDING,
  PASSWORD_FORGET
} from "./../../Constants/Routes";
import Routes from "../../Routes/Routes";
import { Route } from "react-router-dom";
import SignUpPage from "./../../Components/SignUp/SignUp";
import SignInPage from "./../../Components/SignIn/SignIn";
import About from "./../../Components/About/About";
import Sprints from "./../../Components/Sprints/Sprints";
import Admin from "./../../Components/Admin/Admin";
import Landing from "../../Components/Landing/Landing";
import Loading from "../../Components/Layout/Loading";
import ForgottenPassord from "./../../Components/ForgottenPassword/ForgottenPassord";

describe("Routes", () => {
  let component;
  it("should have these routes when logged in", () => {
    component = shallow(<Routes isLoggedIn={true} />);
    assertRouteDoesNotExist(component, SIGN_IN, SignInPage);
    assertRouteDoesNotExist(component, LANDING, Loading);
    assertRouteDoesNotExist(component, PASSWORD_FORGET, ForgottenPassord);
    assertRouteDoesNotExist(component, SIGN_UP, SignUpPage);
    assertRouteExists(component, ADMIN, Admin);
    assertRouteExists(component, ABOUT, About);
    assertRouteExists(component, SPRINTS, Sprints);
  });

  it("should have these routes when not logged in", () => {
    component = shallow(<Routes isLoggedIn={false} />);

    assertRouteExists(component, LANDING, Landing);
    assertRouteDoesNotExist(component, ABOUT, About);
    assertRouteDoesNotExist(component, ADMIN, Admin);
    assertRouteExists(component, SIGN_UP, SignUpPage);
    assertRouteExists(component, SIGN_IN, SignInPage);
    assertRouteExists(component, PASSWORD_FORGET, ForgottenPassord);
  });
});

const assertRouteExists = (component, path, expectedComponent) => {
  expect(
    component
      .find(Route)
      .filterWhere(
        route =>
          route.prop("path") === path &&
          route.prop("component") === expectedComponent
      )
  ).toHaveLength(1);
};

const assertRouteDoesNotExist = (component, path, expectedComponent) => {
  expect(
    component
      .find(Route)
      .filterWhere(
        route =>
          route.prop("path") === path &&
          route.prop("component") === expectedComponent
      )
  ).toHaveLength(0);
};
