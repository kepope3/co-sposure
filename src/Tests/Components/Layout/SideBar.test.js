import { shallow } from "enzyme";
import React from "react";
import SideBar, { AccountSection } from "../../../Components/Layout/SideBar";
import { setGlobal } from "reactn";
import { setGlobalObject } from "../../../Helpers/global";
import { NO_ACCOUNT_NAME, NEW_PROJECT } from "./../../../Constants/Modal";
import { Link } from "react-router-dom";
import { SPRINTS, HOME, ADMIN, ABOUT } from "./../../../Constants/Routes";
import { setProject } from "./../../../Components/Utilities/Listener";

jest.mock("../../../Helpers/global", () => ({
  setGlobalObject: jest.fn()
}));

jest.mock("./../../../Components/Utilities/Listener", () => ({
  setProject: jest.fn()
}));

describe("SideBar", () => {
  beforeEach(() => {
    setGlobalObject.mockClear();
    setProject.mockClear();
  });

  setGlobal({
    account: { user: { email: "test@test.com" } },
    projects: {
      loaded: null,
      list: null
    },
    modal: {}
  });

  it("should collapse side bar and invoke prop when toggle clicked", () => {
    const bodyWidthHandler = jest.fn();
    const component = shallow(<SideBar bodyWidthHandler={bodyWidthHandler} />);

    component.find("#toggleButton").simulate("click");
    expect(component.find(".sideBar").prop("className")).toContain("collapsed");
    expect(bodyWidthHandler).toHaveBeenCalled();
  });

  it("should have tiggleButton", () => {
    const bodyWidthHandler = jest.fn();
    const component = shallow(<SideBar bodyWidthHandler={bodyWidthHandler} />);

    expect(component.find("i")).toHaveLength(1);
  });

  it("should have body content", () => {
    const bodyWidthHandler = jest.fn();
    const component = shallow(<SideBar bodyWidthHandler={bodyWidthHandler} />);

    expect(component.find("#body")).toHaveLength(1);
  });

  it("should have account section if has finished initial loading", () => {
    setGlobal({
      account: {
        user: { email: "test@test.com" }
      },
      projects: {
        loaded: null,
        list: null
      },
      modal: {}
    });
    const bodyWidthHandler = jest.fn();
    const component = shallow(<SideBar bodyWidthHandler={bodyWidthHandler} />);

    expect(component.find(AccountSection)).toHaveLength(1);
  });

  describe("Account section", () => {
    it("should display email address from account holder", () => {
      const component = shallow(<AccountSection />);

      expect(component.find("#emailAddress").html()).toContain("test@test.com");
    });

    it("should set modal mode to 'noAccountName' on click and display message if account name not set", () => {
      setGlobal({
        account: { user: { email: "test@test.com" } },
        projects: {
          loaded: null,
          list: null
        }
      });
      const component = shallow(<AccountSection />);

      component.find("#setAccountName").simulate("click");

      expect(setGlobalObject).toHaveBeenCalledWith(
        "modal",
        "mode",
        NO_ACCOUNT_NAME
      );
    });

    it("should set modal mode to 'newProject' on click and display message if there are no projects", () => {
      setGlobal({
        account: { user: { email: "test@test.com", name: "john" } },
        projects: {
          loaded: null,
          list: null
        }
      });
      const component = shallow(<AccountSection />);

      component.find("#addProject").simulate("click");

      expect(setGlobalObject).toHaveBeenCalledWith(
        "modal",
        "mode",
        NEW_PROJECT
      );
    });

    it("should display dropdown with projects if user has projects", () => {
      setGlobal({
        account: { user: { email: "test@test.com" } },
        projects: {
          loaded: "project",
          list: ["project", "project"]
        }
      });
      const component = shallow(<AccountSection />);

      expect(component.find("#projects")).toHaveLength(1);
    });

    it("should have a link to home, account and sprints page", () => {
      const component = shallow(<AccountSection />);

      const btnWrapper = component.find(".btnWrapper");
      expect(btnWrapper.find(Link).get(0).props.to).toBe(SPRINTS);
      expect(btnWrapper.find(Link).get(1).props.to).toBe(ADMIN);
      expect(btnWrapper.find(Link).get(2).props.to).toBe(ABOUT);
    });

    it("should be able to switch projects", () => {
      const component = shallow(<AccountSection />);

      setGlobal({ projects: { loaded: { key: 1 } } });
      component.instance().onChangeProjectHandler({ target: { value: 2 } });

      expect(setGlobalObject).toHaveBeenCalledWith("sprints", "list", null);
      expect(setGlobalObject).toHaveBeenCalledWith(
        "sprints",
        "currentSprint",
        null
      );

      expect(setGlobalObject).toHaveBeenCalledWith("modal", "mode", null);

      expect(setProject).toHaveBeenCalledWith(1, false);
      expect(setProject).toHaveBeenCalledWith(2);
    });
  });
});
