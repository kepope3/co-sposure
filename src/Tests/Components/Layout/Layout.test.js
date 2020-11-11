import { shallow } from "enzyme";
import React from "react";
import Layout from "../../../Components/Layout/Layout";
import { setGlobal } from "reactn";
import { Link } from "react-router-dom";
import { SIGN_IN } from "./../../../Constants/Routes";
import Loading from "./../../../Components/Layout/Loading";
import SideBar from "./../../../Components/Layout/SideBar";
import Modal from "./../../../Components/Shared/Modal";
import Alert from "./../../../Components/Shared/Alert";

describe("Layout", () => {
  it("should display sign in link if not authenticated and route to sign in", () => {
    setGlobal({ account: { isLoggedIn: false } });
    const component = shallow(<Layout />);

    expect(component.find("#signOut")).toHaveLength(0);
    expect(component.find("#signIn")).toHaveLength(1);

    expect(
      component
        .find("#signIn")
        .find(Link)
        .prop("to")
    ).toBe(SIGN_IN);
  });

  it("should display sign out link if authenticated and route to sign out", () => {
    setGlobal({ account: { isLoggedIn: true, isEmailVerified: true } });
    const component = shallow(<Layout />);

    expect(component.find("#signOut")).toHaveLength(1);
    expect(component.find("#signIn")).toHaveLength(0);
  });

  it("should render children", () => {
    const children = <div id="ya" />;
    const component = shallow(<Layout>{children}</Layout>);

    expect(component.find("#ya")).toHaveLength(1);
  });

  it("should have loading component", () => {
    const component = shallow(<Layout />);

    expect(component.find(Loading)).toHaveLength(1);
  });

  it("should have sidebar, modal and alert component if logged in", () => {
    setGlobal({ account: { isLoggedIn: true, isEmailVerified: true } });
    const component = shallow(<Layout />);

    expect(component.find(SideBar)).toHaveLength(1);
    expect(component.find(Modal)).toHaveLength(1);
    expect(component.find(Alert)).toHaveLength(1);
  });

  it("should have logged out content if user not logged in", () => {
    setGlobal({ account: { isLoggedIn: false, isEmailVerified: false } });
    const component = shallow(<Layout />);

    expect(component.find("#loggedOutContent")).toHaveLength(1);
  });

  it("should display verify email message if not yet verified", () => {
    setGlobal({ account: { isLoggedIn: true, isEmailVerified: false } });
    const component = shallow(<Layout />);

    expect(component.find("#loggedOutContent")).toHaveLength(0);
    expect(component.find("#verifyEmail")).toHaveLength(1);
  });
});
