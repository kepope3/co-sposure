import { shallow } from "enzyme";
import EditStory from "../../../Components/ModalContent/EditStory";
import React from "react";
import { setGlobal } from "reactn";
import { setGlobalObject } from "./../../../Helpers/global";

global.scrollTo = jest.fn();
const tasks = [{ id: "t/1", storyId: "s/1" }, { id: "t/2", storyId: "s/2" }];
const stories = [
  {
    id: "s/1",
    name: "me",
    description: "description",
    epicName: "epicName",
    points: 1,
    isComplete: undefined
  },
  {
    id: "s/3",
    name: "dfd",
    description: "descriptdfdfion",
    epicName: "epicNaddme",
    points: 1,
    isComplete: false
  }
];
describe("EditStory", () => {
  let component;
  beforeEach(() => {
    setGlobal({
      story: { id: "s/1", sprint: { name: "Sprint 1" } },
      sprints: {
        currentSprint: {
          stories,
          tasks,
          name: "Sprint 1"
        }
      }
    });
    component = shallow(<EditStory />);
  });

  it("should have title and form ", () => {
    expect(component.find("h3")).toHaveLength(1);
    expect(component.find("form")).toHaveLength(1);
  });

  it("should have 6 input fields", () => {
    expect(component.find("input")).toHaveLength(5);
    expect(component.find("textarea")).toHaveLength(1);
  });

  it("should have form populated from story id", () => {
    const inputs = component.find("input");
    expect(inputs.get(0).props.value).toBe("s/1");
    expect(inputs.get(1).props.value).toBe("me");
    expect(inputs.get(2).props.value).toBe("epicName");
    expect(inputs.get(3).props.value).toBe(1);
    expect(inputs.get(4).props.checked).toBe(false);

    expect(component.find("textarea").prop("value")).toBe("description");
  });

  it("should display which sprint the story currently belongs to", () => {
    expect(component.find("#storySprint").html()).toContain("Sprint 1");
  });

  it("should display current sprint", () => {
    setGlobal({
      story: { id: "s/1", sprint: { name: "Sprint 1" } },
      sprints: {
        currentSprint: {
          stories,
          tasks,
          name: "Sprint 2"
        }
      }
    });
    const component = shallow(<EditStory />);
    expect(component.find("#currentSprint").html()).toContain("Sprint 2");
  });

  it("should not display current sprint if it is the same as current story sprint", async () => {
    setGlobal({
      story: { id: "s/1", sprint: { name: "Sprint 1" } },
      sprints: {
        currentSprint: {
          stories,
          tasks,
          name: "Sprint 1"
        }
      }
    });
    component = shallow(<EditStory />);
    expect(component.find("#currentSprint")).toHaveLength(0);
  });

  it("should update story when update story clicked", async () => {
    const updateCallback = obj => {
      return Promise.resolve();
    };
    const updateFunction = jest.fn(updateCallback);

    const then = callback => callback({ val: () => ({ stories }) });
    const once = () => ({ then });
    setGlobal({
      story: { id: "s/1", sprint: { name: "Sprint 1" } },
      sprints: {
        currentSprint: {
          stories,
          tasks,
          name: "Sprint 1"
        }
      }
    });
    setGlobalObject("firebase", "update", updateFunction);
    setGlobalObject("firebase", "getSprint", () => ({
      once
    }));

    component.instance().setState({
      id: "s/1",
      name: "John",
      description: "description",
      epicName: "epicName",
      points: 1,
      isComplete: true,
      storySprintKey: "23231"
    });

    await component.instance().onSubmit({ preventDefault: () => {} });

    expect(updateFunction).toHaveBeenCalledWith({
      "/sprints/23231/stories": [
        {
          description: "description",
          epicName: "epicName",
          id: "s/1",
          isComplete: true,
          name: "John",
          points: 1
        },
        {
          description: "descriptdfdfion",
          epicName: "epicNaddme",
          id: "s/3",
          isComplete: false,
          name: "dfd",
          points: 1
        }
      ]
    });
    // expect(global.scrollTo).toHaveBeenCalledWith(3);
  });

  it("should move story and task to new sprint if sprint is different", async () => {
    const updateCallback = obj => {
      return Promise.resolve();
    };
    const updateFunction = jest.fn(updateCallback);

    const tasks = [
      { id: "t/1", storyId: "s/1" },
      { id: "t/2", storyId: "s/1" }
    ];

    const then = callback => callback({ val: () => ({ stories, tasks }) });
    const once = () => ({ then });

    const global = {
      story: { id: "s/1", sprint: { name: "Sprint 1", tasks } },
      sprints: {
        currentSprint: {
          stories,
          tasks: [],
          name: "Sprint 2",
          key: "12323"
        }
      },
      firebase: {
        update: updateFunction,
        getSprint: () => ({
          once
        })
      }
    };
    setGlobal(global);

    component = shallow(<EditStory />);

    component.instance().setState({
      id: "s/1",
      name: "John",
      description: "description",
      epicName: "epicName",
      points: 1,
      isComplete: true,
      storySprintKey: "23231"
    });

    component.instance().deleteStory = jest.fn();

    await component.instance().onSubmit({ preventDefault: () => {} });

    expect(updateFunction).toHaveBeenCalledWith({
      "/sprints/12323/stories": [
        {
          description: "description",
          epicName: "epicName",
          id: "s/1",
          isComplete: true,
          name: "John",
          points: 1
        },
        {
          description: "descriptdfdfion",
          epicName: "epicNaddme",
          id: "s/3",
          isComplete: false,
          name: "dfd",
          points: 1
        },
        {
          description: "description",
          epicName: "epicName",
          id: "s/1",
          isComplete: true,
          name: "John",
          points: 1
        }
      ],
      "/sprints/12323/tasks": [
        { id: "t/1", storyId: "s/1" },
        { id: "t/2", storyId: "s/1" }
      ]
    });

    expect(component.instance().deleteStory).toHaveBeenCalled();
  });

  it("should delete story and tasks when delete button is clicked", async () => {
    global.confirm = () => true;
    const updateCallback = obj => {
      return Promise.resolve();
    };
    const updateFunction = jest.fn(updateCallback);

    const then = callback => callback({ val: () => ({ stories, tasks }) });
    const once = () => ({ then });
    setGlobalObject("firebase", "update", updateFunction);
    setGlobalObject("firebase", "getSprint", () => ({
      once
    }));

    component.instance().setState({
      id: "s/1",
      storySprintKey: "23231"
    });

    await component.instance().onDelete({ preventDefault: () => {} });

    expect(updateFunction).toHaveBeenCalledWith({
      "/sprints/23231/stories": [
        {
          description: "descriptdfdfion",
          epicName: "epicNaddme",
          id: "s/3",
          isComplete: false,
          name: "dfd",
          points: 1
        }
      ],
      "/sprints/23231/tasks": [{ id: "t/2", storyId: "s/2" }]
    });
  });
});
