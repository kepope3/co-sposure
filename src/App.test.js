import React from "react";
import App from "./App";
import RootState from "./GlobalState/RootState";
import { shallow } from "enzyme";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes/Routes";
import Layout from "./Components/Layout/Layout";
import { setGlobal, getGlobal } from "reactn";
import Listener from "./Components/Utilities/Listener";

jest.mock("./GlobalState/RootState");
let authUser;
let isLoggedIn;
let onAuthStateChanged = jest.fn();

describe("App", () => {
  beforeEach(() => {
    onAuthStateChanged.mockClear();
  });
  it("should invoke global state", () => {
    setGlobalAndMount();
    expect(RootState).toHaveBeenCalled();
  });

  it("should include router and routes", () => {
    const component = setGlobalAndMount();
    const router = component.find(Router);

    expect(router).toHaveLength(1);
    expect(router.find(Routes)).toHaveLength(1);
  });

  it("should have layout", () => {
    const component = setGlobalAndMount();

    expect(component.find(Layout)).toHaveLength(1);
  });

  it("should have listener component", () => {
    const component = setGlobalAndMount();

    expect(component.find(Listener)).toHaveLength(1);
  });
});

const setGlobalAndMount = () => {
  setGlobal({
    firebase: { authUser, auth: { onAuthStateChanged } },
    account: { isLoggedIn }
  });
  return shallow(<App />);
};
