import { shallow } from "enzyme";
import React from "react";
import { setGlobal } from "reactn";
import { setGlobalObject } from "./../../../Helpers/global";
import NewProject, {
  BACKLOG
} from "../../../Components/ModalContent/NewProject";
import { SUCCESS_NEW_PROJECT } from "./../../../Constants/Alerts";
import { addNewSprint } from "./../../../Components/Utilities/projectHelper";

jest.mock("../../../Helpers/global", () => ({
  setGlobalObject: jest.fn()
}));

jest.mock("./../../../Components/Utilities/projectHelper", () => ({
  addNewSprint: jest.fn()
}));

describe("SetAccountName", () => {
  beforeEach(() => {
    setGlobalObject.mockClear();
    addNewSprint.mockClear();
  });

  it("should have form with 1 field", () => {
    const component = shallow(<NewProject />);

    expect(component.find("form")).toHaveLength(1);
    expect(component.find("input")).toHaveLength(1);
    expect(component.find("button")).toHaveLength(1);
  });

  it("should set new project/sprint and close modal when valid name submitted and no error", async () => {
    const expectedName = "project1";
    const newProjectKey = "24";
    const authUser = { uid: 45 };
    const updateCallback = obj => {
      return Promise.resolve();
    };
    const updateFunction = jest.fn(updateCallback);

    const expectedUpdate = {
      "/projects/24/creationDate": undefined,
      "/projects/24/currentSprintNo": 1,
      "/projects/24/currentStoryNo": 1,
      "/projects/24/currentTaskNo": 1,
      "/projects/24/members/45": 45,
      "/projects/24/name": "project1",
      "/projects/24/sprintLength": 7,
      "/users/45/projects/24": { key: "24", name: "project1", owner: true }
    };

    setGlobal({
      firebase: {
        authUser: authUser,
        getProjects: {
          push: () => ({
            key: newProjectKey
          })
        },
        update: updateFunction
      }
    });

    const component = shallow(<NewProject />);

    component.setState({ name: expectedName });

    await component.instance().onSubmit({ preventDefault: () => {} });

    expect(updateFunction).toHaveBeenCalledWith(expectedUpdate);

    expect(setGlobalObject).toHaveBeenCalledWith("modal", "mode", null);
    expect(setGlobalObject).toHaveBeenCalledWith(
      "account",
      "alert",
      SUCCESS_NEW_PROJECT
    );
    expect(addNewSprint).toHaveBeenCalledWith(newProjectKey, authUser.uid, 1);
    expect(addNewSprint).toHaveBeenCalledWith(
      newProjectKey,
      authUser.uid,
      BACKLOG
    );
  });
});
