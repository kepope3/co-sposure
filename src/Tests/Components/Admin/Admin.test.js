import { setGlobalObject } from "../../../Helpers/global";
import { NEW_PROJECT } from "../../../Constants/Modal";
import { shallow } from "enzyme";
import Admin from "../../../Components/Admin/Admin";
import React from "react";
import { setGlobal } from "reactn";
import { SUCCESS_UPDATED_SPRINT_LENGTH } from "./../../../Constants/Alerts";
jest.mock("../../../Helpers/global", () => ({
  setGlobalObject: jest.fn()
}));

describe("Admin", () => {
  let component;

  beforeEach(() => {
    setGlobalObject.mockClear();
    setGlobal({
      account: { user: { projects: { "34": { owner: false } } } },
      projects: { loaded: { key: 34 } }
    });
    component = shallow(<Admin />);
  });

  it("should be able to add project", () => {
    component.find("#addProject").simulate("click");
    expect(setGlobalObject).toHaveBeenCalledWith("modal", "mode", NEW_PROJECT);
  });

  it("should be able to change sprint lenghths ", async () => {
    const mockedUpdate = jest.fn().mockResolvedValue("");
    setGlobal({
      account: { user: { projects: { "34": { owner: true } } } },
      firebase: { update: mockedUpdate },
      projects: { loaded: { key: 34 } }
    });
    component = shallow(<Admin />);

    await component
      .find("#sprintLength")
      .simulate("change", { target: { value: 14 } });

    expect(mockedUpdate).toHaveBeenCalledWith({
      "/projects/34/sprintLength": 14
    });

    expect(setGlobalObject).toHaveBeenCalledWith(
      "account",
      "alert",
      SUCCESS_UPDATED_SPRINT_LENGTH
    );
  });

  it("should not show add user feature if not owner", () => {
    setGlobal({
      account: { user: { projects: { "34": { owner: false } } } },
      projects: { loaded: { key: 34, members: { "1": 1 } } }
    });
    component = shallow(<Admin />);
    expect(component.find("#addMember")).toHaveLength(0);
  });

  it("should be able to add members to a project", async () => {
    const mockedUpdate = jest.fn().mockResolvedValue("");
    const mockedgetUserIdByEmail = jest.fn(() => ({
      once: () => Promise.resolve({ val: () => ({ keith: "keith" }) })
    }));
    setGlobal({
      account: { user: { projects: { "34": { owner: true } } } },
      firebase: {
        getSprint: () => ({
          once: () => ({ val: () => ({ members: {} }) })
        }),
        update: mockedUpdate,
        getUserIdByEmail: mockedgetUserIdByEmail
      },
      projects: {
        loaded: { sprints: { 1: "sprint 1" }, key: 34, members: { "1": 1 } }
      }
    });
    component = shallow(<Admin />);

    await component.find("#addMember").simulate("submit", {
      preventDefault: () => {}
    });

    expect(setGlobalObject).toHaveBeenCalledWith("account", "isLoading", true);

    expect(mockedUpdate).toHaveBeenCalledWith({
      "/projects/34/members": { "1": 1, keith: undefined },
      "/sharedProjects/keith/34": undefined,
      "/sprints/1/members/keith": "keith"
    });
  });

  it("should display list of members excluding the user, if the owner", () => {
    setGlobal({
      account: { user: { uid: "1", projects: { "34": { owner: true } } } },

      projects: {
        loaded: {
          sprints: { 1: "sprint 1" },
          key: 34,
          members: { "1": 1, "2": 2 }
        }
      }
    });
    component = shallow(<Admin />);
    const membersList = component.find("#membersList");

    expect(membersList.find("option")).toHaveLength(2);
  });

  it("should remove selected member when delete member button is clicked", () => {
    const remove = jest.fn().mockResolvedValue();
    const getSprintMember = jest.fn(() => ({ remove }));
    const getProjectMember = jest.fn(() => ({ remove }));
    const getSharedMemberProject = jest.fn(() => ({ remove }));

    setGlobal({
      account: { user: { uid: "1", projects: { "34": { owner: true } } } },
      firebase: { getSprintMember, getProjectMember, getSharedMemberProject },
      projects: { loaded: { sprints: { "1": 1, "2": 2 }, key: "34" } }
    });

    component = shallow(<Admin />);
    component.setState({ selectedMember: 2 });

    component.instance().onRemoveMemberHandler();

    expect(getSprintMember).toHaveBeenCalledWith("2", 2);
    expect(getProjectMember).toHaveBeenCalledWith("34", 2);
    expect(getSharedMemberProject).toHaveBeenCalledWith(2, "34");
    expect(remove).toHaveBeenCalledTimes(4);
  });

  it("should be able to remove current project if the owner", () => {
    const remove = jest.fn().mockResolvedValue();
    const getSprint = jest.fn(() => ({ remove }));
    const getProject = jest.fn(() => ({ remove }));

    global.confirm = () => true;
    setGlobal({
      firebase: { getSprint, getProject },
      projects: { loaded: { key: "34", sprints: { "1": 1, "2": 2 } } },
      account: { user: { uid: "1", projects: { "34": { owner: true } } } }
    });
    component = shallow(<Admin />);
    component.instance().onRemoveProjectHandler();

    expect(getSprint).toHaveBeenCalledWith("1");
    expect(getSprint).toHaveBeenCalledWith("2");
    expect(getProject).toHaveBeenCalledWith("34");

    expect(remove).toHaveBeenCalledTimes(3);
  });
});
