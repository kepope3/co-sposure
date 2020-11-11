import { shallow } from "enzyme";
import React from "react";
import Story from "./../../../Components/Story/Story";
import Container from "./../../../Components/Story/Container";
import { TODO, IN_PROGRESS, DONE } from "./../../../Constants/Task";
import { setGlobal } from "reactn";
import { EDIT_STORY } from "../../../Constants/Modal";
import { setGlobalObject } from "./../../../Helpers/global";

jest.mock("../../../Helpers/global", () => ({
  setGlobalObject: jest.fn()
}));

global.scrollTo = jest.fn();

describe("Story", () => {
  const props = {
    tasks: [
      {
        id: 23,
        storyId: "story1", //do this
        containerType: TODO, //do this
        containerId: 1,
        name: "QA",
        assignee: "keith"
      },
      {
        id: 23,
        storyId: "story1", //do this
        containerType: TODO, //do this
        containerId: 1,
        name: "QA",
        assignee: "keith"
      },
      {
        id: 23,
        storyId: "story1", //do this
        containerType: IN_PROGRESS, //do this
        containerId: 2,
        name: "QA",
        assignee: "keith"
      },
      {
        id: 23,
        storyId: "story1", //do this
        containerType: IN_PROGRESS, //do this
        containerId: 2,
        name: "QA",
        assignee: "keith"
      },
      {
        id: 23,
        storyId: "story1", //do this
        containerType: DONE, //do this
        containerId: 3,
        name: "QA",
        assignee: "keith"
      }
    ],
    storyId: 2
  };

  let component;
  beforeEach(() => {
    setGlobal({
      sprints: { currentSprint: { key: 43, tasks: [...props.tasks] } }
    });
    component = shallow(<Story {...props} />);
    setGlobalObject.mockClear();
  });
  it("should have row with 3 column containers", () => {
    expect(component.find(".row")).toHaveLength(1);
    expect(component.find(Container)).toHaveLength(3);
  });

  it("should be able to add new task", () => {
    const currentTaskNo = 1;
    const mockUpdate = jest.fn();
    setGlobal({
      projects: {
        loaded: { key: 3, currentTaskNo, tasks: { ...props.tasks } }
      },
      firebase: { update: mockUpdate }
    });

    const expectedUpdate = {
      "/projects/3/currentTaskNo": 2,
      "/sprints/43/tasks": [
        {
          assignee: "keith",
          containerId: 1,
          containerType: "TODO",

          id: 23,
          name: "QA",
          storyId: "story1"
        },
        {
          assignee: "keith",
          containerId: 1,
          containerType: "TODO",

          id: 23,
          name: "QA",
          storyId: "story1"
        },
        {
          assignee: "keith",
          containerId: 2,
          containerType: "IN PROGRESS",

          id: 23,
          name: "QA",
          storyId: "story1"
        },
        {
          assignee: "keith",
          containerId: 2,
          containerType: "IN PROGRESS",

          id: 23,
          name: "QA",
          storyId: "story1"
        },
        {
          assignee: "keith",
          containerId: 3,
          containerType: "DONE",

          id: 23,
          name: "QA",
          storyId: "story1"
        },
        { containerType: "TODO", id: "t/1", storyId: 2 }
      ]
    };

    component.find(".fa-plus").simulate("click");

    expect(mockUpdate).toHaveBeenCalledWith(expectedUpdate);
  });
  it("should pass todo tasks, story id and container type to container 1", () => {
    const containerOne = component.find(Container).get(0);
    expect(containerOne.props.tasks).toStrictEqual([
      props.tasks[0],
      props.tasks[1]
    ]);
    expect(containerOne.props.storyId).toBe(props.storyId);
    expect(containerOne.props.containerType).toBe(TODO);
  });
  it("should pass in progress tasks, story and container ids to container 2", () => {
    const containerTwo = component.find(Container).get(1);
    expect(containerTwo.props.tasks).toStrictEqual([
      props.tasks[2],
      props.tasks[3]
    ]);
    expect(containerTwo.props.storyId).toBe(props.storyId);
    expect(containerTwo.props.containerType).toBe(IN_PROGRESS);
  });

  it("should pass done tasks, story and container ids to container 3", () => {
    const containerThree = component.find(Container).get(2);
    expect(containerThree.props.tasks).toStrictEqual([props.tasks[4]]);
    expect(containerThree.props.storyId).toBe(props.storyId);
    expect(containerThree.props.containerType).toBe(DONE);
  });

  it("should hide if done is set to true and show tick", () => {
    const testProps = { ...props, isComplete: true };
    component = shallow(<Story {...testProps} />);
    expect(component.find("#containers").prop("className")).toContain("hide");
    expect(component.find(".fa-check-square")).toHaveLength(1);
  });
  it("should have bar with onclick event which toggles hide class", () => {
    expect(component.find("#containers").prop("className")).not.toContain(
      "hide"
    );

    component.find("#bar").simulate("click");

    expect(component.find("#containers").prop("className")).toContain("hide");
  });

  it("should have clickable edit icon", () => {
    const icon = component.find(".edit");

    const handler = component.instance().editHandler;
    expect(icon.prop("onClick")).toBe(handler);
  });

  it("should cancel bubbling and open modal on edit button click", () => {
    let event = { cancelBubble: false };

    component.instance().editHandler(event);

    expect(event.cancelBubble).toBe(true);
    expect(setGlobalObject).toHaveBeenCalledWith("story", "id", props.storyId);
    expect(setGlobalObject).toHaveBeenCalledWith("story", "sprint", {
      key: 43,
      tasks: [
        {
          assignee: "keith",
          containerId: 1,
          containerType: "TODO",
          id: 23,
          name: "QA",
          storyId: "story1"
        },
        {
          assignee: "keith",
          containerId: 1,
          containerType: "TODO",
          id: 23,
          name: "QA",
          storyId: "story1"
        },
        {
          assignee: "keith",
          containerId: 2,
          containerType: "IN PROGRESS",
          id: 23,
          name: "QA",
          storyId: "story1"
        },
        {
          assignee: "keith",
          containerId: 2,
          containerType: "IN PROGRESS",
          id: 23,
          name: "QA",
          storyId: "story1"
        },
        {
          assignee: "keith",
          containerId: 3,
          containerType: "DONE",
          id: 23,
          name: "QA",
          storyId: "story1"
        }
      ]
    });
    expect(setGlobalObject).toHaveBeenCalledWith("modal", "mode", EDIT_STORY);
    expect(global.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("should have clickable sortDownHandler icon", () => {
    const icon = component.find(".fa-chevron-down");

    const handler = component.instance().sortDownHandler;
    expect(icon.prop("onClick")).toBe(handler);
  });

  it("should be able to move story down to another place in list", () => {
    const globalStories = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const updateMock = jest.fn();
    setGlobal({
      firebase: { update: updateMock },
      sprints: { currentSprint: { stories: [...globalStories] } }
    });
    let event = { cancelBubble: false };

    component.instance().sortDownHandler(event);

    expect(event.cancelBubble).toBe(true);

    expect(updateMock).toHaveBeenCalledWith({
      "/sprints/undefined/stories": [{ id: 1 }, { id: 3 }, { id: 2 }]
    });
  });

  it("should be able to move story up to another place in list", () => {
    const globalStories = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const updateMock = jest.fn();
    setGlobal({
      firebase: { update: updateMock },
      sprints: { currentSprint: { stories: [...globalStories] } }
    });

    let event = { cancelBubble: false };

    component.instance().sortUpHandler(event);

    expect(event.cancelBubble).toBe(true);

    expect(updateMock).toHaveBeenCalledWith({
      "/sprints/undefined/stories": [{ id: 2 }, { id: 1 }, { id: 3 }]
    });
  });
});
