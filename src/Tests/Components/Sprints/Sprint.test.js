import { shallow } from "enzyme";
import React from "react";
import { setGlobal, getGlobal } from "reactn";
import Sprints from "./../../../Components/Sprints/Sprints";
import {
  daysLeftForSprint,
  addNewSprint
} from "../../../Components/Utilities/projectHelper";
import { setSprint } from "../../../Components/Utilities/Listener";
import {
  SUCCESS_NEW_SPRINT,
  FAILED_NEW_SPRINT
} from "./../../../Constants/Alerts";
import { setGlobalObject } from "./../../../Helpers/global";
import { NEW_STORY } from "../../../Constants/Modal";
import Story from "../../../Components/Story/Story";
import { BACKLOG } from "./../../../Components/ModalContent/NewProject";
import ProgressBar from "../../../Components/Sprints/ProgressBar";

jest.mock("../../../Components/Utilities/projectHelper", () => ({
  daysLeftForSprint: jest.fn(() => 5),
  addNewSprint: jest.fn(() => ({ heere: "one" }))
}));

jest.mock("../../../Components/Utilities/Listener", () => ({
  setSprint: jest.fn()
}));

jest.mock("./../../../Helpers/global", () => ({
  setGlobalObject: jest.fn()
}));

let component;
describe("Sprints", () => {
  beforeEach(() => {
    setSprint.mockClear();
    addNewSprint.mockClear();
    daysLeftForSprint.mockClear();
    setGlobalObject.mockClear();
  });
  it("should display current sprint and remaining days", () => {
    const expectedSprint = { name: "test", creationDate: "122312321321" };
    setGlobalAndMount({
      sprints: { currentSprint: expectedSprint },
      projects: { loaded: {} }
    });
    expect(component.find("#sprintHeading")).toHaveLength(1);
    expect(component.find("#sprintHeading strong").text()).toContain(
      expectedSprint.name
    );
    expect(component.find("#sprintHeading").text()).toContain(
      "- 5 days remaining."
    );
  });
  it("should only show sprint name when it is backlog", () => {
    const expectedSprint = { name: BACKLOG, creationDate: "122312321321" };
    setGlobalAndMount({
      sprints: { currentSprint: expectedSprint },
      projects: { loaded: {} }
    });

    expect(component.find("#sprintHeading strong").text()).toContain(
      expectedSprint.name
    );

    expect(component.find("#sprintHeading").text()).not.toContain(
      "- 5 days remaining."
    );
  });

  it("should create a new sprint when create new sprint button is clicked", async () => {
    const updateMock = jest.fn(
      () =>
        new Promise(resolve => {
          resolve();
        })
    );
    daysLeftForSprint.mockReturnValue(0);

    setGlobalAndMount({
      sprints: {
        currentSprint: { key: "321", name: "sprint 1" },
        list: [{ id: "321" }]
      },
      firebase: { update: updateMock },
      projects: { loaded: { key: "123" } },
      account: { user: { uid: "5" } }
    });

    await component.find("#newSprintBtn").simulate("click");

    expect(addNewSprint).toHaveBeenCalledWith("123", "5");
    expect(updateMock).toHaveBeenCalledWith({ heere: "one" });
    expect(setSprint).toHaveBeenCalledWith("321", false);
    expect(setGlobalObject).toHaveBeenCalledWith(
      "account",
      "alert",
      SUCCESS_NEW_SPRINT
    );
  });

  it("should not create a new sprint when create new sprint button is clicked and problem", async () => {
    const updateMock = jest.fn(
      () =>
        new Promise((resolve, reject) => {
          reject();
        })
    );
    daysLeftForSprint.mockReturnValue(0);

    setGlobalAndMount({
      sprints: { currentSprint: { key: "321", name: "sprint 1" } },
      firebase: { update: updateMock },
      projects: { loaded: { key: "123" } },
      account: { user: { uid: "5" } }
    });

    await component.instance().newSprintHandler();

    expect(addNewSprint).toHaveBeenCalledWith("123", "5");
    expect(updateMock).toHaveBeenCalledWith({ heere: "one" });
    expect(setSprint).not.toHaveBeenCalledWith("321", false);
    expect(getGlobal().account.alert).not.toBe(SUCCESS_NEW_SPRINT);
    expect(setGlobalObject).toHaveBeenCalledWith(
      "account",
      "alert",
      FAILED_NEW_SPRINT
    );
  });

  it("should not give option to create a new sprint if days left is greater than 0", () => {
    daysLeftForSprint.mockReturnValue(5);

    setGlobalAndMount({
      sprints: { currentSprint: "sprint 1" }
    });

    expect(component.find("#newSprintBtn")).toHaveLength(0);
  });

  it("should display list of sprints", () => {
    setGlobalAndMount({
      sprints: { currentSprint: "sprint 1", list: [] }
    });

    expect(component.find("#sprintList")).toHaveLength(1);
  });
  it("should display add new project message if no projects", () => {
    setGlobalAndMount({
      projects: { loaded: null }
    });

    expect(component.find("#noProjects")).toHaveLength(1);
  });

  it("should have progressBar component", () => {
    setGlobalAndMount({
      sprints: { currentSprint: { stories: [{ id: 1 }] } },
      projects: { loaded: {} }
    });
    expect(component.find(ProgressBar)).toHaveLength(1);
    expect(component.find(ProgressBar).prop("stories")).toStrictEqual([
      { id: 1 }
    ]);
  });

  it("should change sprint when dropdown option changes", () => {
    setGlobalAndMount({
      sprints: {
        currentSprint: "sprint 1",
        list: [{ id: "1", name: "Sprint 1" }, { id: "2", name: "Sprint 2" }]
      },
      projects: { loaded: {} }
    });

    component
      .find("#sprintList")
      .simulate("change", { target: { value: "1" } });

    expect(setSprint).toHaveBeenCalledWith("1");
    expect(setSprint).toHaveBeenCalledWith(undefined, false);
  });
  it("should have create new story button", () => {
    setGlobalAndMount({
      sprints: { currentSprint: "sprint 1", list: [] }
    });

    expect(component.find("#createStory")).toHaveLength(1);
  });
  it("should open modal when create new modal clicked", () => {
    setGlobalAndMount({
      sprints: { currentSprint: "sprint 1", list: [] }
    });

    component.find("#createStory").simulate("click");

    expect(setGlobalObject).toHaveBeenCalledWith("modal", "mode", NEW_STORY);
  });
  it("should display stories", () => {
    setGlobalAndMount({
      projects: { loaded: {} },
      sprints: {
        currentSprint: {
          stories: [
            {
              id: 1,
              name: "Create login page",
              description: "hahaha",
              done: false,
              epicId: 1,
              epicName: "Login and registration",
              points: 13
            },
            {
              id: 2,
              name: "Refactor registration page",
              description: "hahaha",
              done: true,
              epicId: 1,
              epicName: "Login and registration",
              points: 8
            }
          ]
        },
        list: []
      }
    });

    expect(component.find(Story)).toHaveLength(2);
    //check stories take in correct props
  });
});

const setGlobalAndMount = globalObject => {
  setGlobal(globalObject);
  component = shallow(<Sprints />);
};
