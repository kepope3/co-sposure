import { shallow } from "enzyme";
import React from "react";
import Task from "./../../../Components/Story/Task";
import { setGlobal, getGlobal } from "reactn";
import { EDIT_TASK } from "../../../Constants/Modal";

describe("Task", () => {
  const props = {
    id: "24",
    name: "frontend",
    description: "TODO: blah",
    assignee: "Andy"
  };

  let component;
  beforeEach(() => {
    component = shallow(<Task {...props} />);
  });

  it("should have name and assignee from props", () => {
    expect(component.html()).toContain(props.name);
    expect(component.html()).toContain(props.assignee);
  });

  it("should have draggable set to true and appropriate events", () => {
    const task = component.find("#task");
    expect(task.prop("draggable")).toBe("true");

    const dragHandler = component.instance().dragStart;
    expect(task.prop("onDragStart")).toBe(dragHandler);

    const dragLeaveHandler = component.instance().dragLeave;
    expect(task.prop("onDragLeave")).toBe(dragLeaveHandler);

    const dragOverHandler = component.instance().dragOver;
    expect(task.prop("onDragOver")).toBe(dragOverHandler);
  });

  it("on dragStart", () => {
    setGlobal({ task: { draggedTask: null } });
    const setData = jest.fn();
    const expectedId = 23;
    component
      .instance()
      .dragStart({ dataTransfer: { setData }, target: { id: expectedId } });

    expect(setData).toHaveBeenCalledWith(expectedId, expectedId);
    expect(getGlobal().task.draggedTask).toMatchObject({ id: props.id });
  });

  it("on dragleave remove on hover class and set dragged over task to null", () => {
    setGlobal({
      task: { draggedOverTask: { id: "dfdsfdsfsdjlk" }, draggedTask: null }
    });
    component.setState({ isOnHover: true });
    component.instance().dragLeave();

    expect(getGlobal().task.draggedOverTask).toBe(null);
    expect(component.find("#task").prop("className")).not.toContain("onHover");
  });

  it("on drag over set draggedOverTask", () => {
    setGlobal({
      task: { draggedOverTask: null, draggedTask: null }
    });

    component.instance().dragOver();

    expect(getGlobal().task.draggedOverTask).toMatchObject({ id: props.id });
  });

  it("should have clickable edit icon", () => {
    const icon = component.find("i");

    const handler = component.instance().editHandler;
    expect(icon.prop("onClick")).toBe(handler);
  });

  it("should cancel bubbling and change mode on edit button click", () => {
    let event = { cancelBubble: false };
    component.setState({ editMode: false });
    component.instance().editHandler(event);

    expect(event.cancelBubble).toBe(true);
    expect(component.state().editMode).toBe(true);
  });

  it("should be in edit mode when editMode is true", () => {
    component = shallow(<Task {...props} />);
    component.setState({ editMode: true });

    expect(component.find(".editModeTask")).toHaveLength(1);
  });

  it("should have form in in edit mode when editMode is true", () => {
    component = shallow(<Task {...props} />);
    component.setState({ editMode: true });

    const editMode = component.find(".editModeTask");
    expect(editMode).toHaveLength(1);
    expect(editMode.find("form")).toHaveLength(1);
    expect(editMode.find("input")).toHaveLength(2);
  });

  it("should have cross which toggles editMode when in edit mode", () => {
    component = shallow(<Task {...props} />);
    component.setState({ editMode: true });

    const editMode = component.find(".editModeTask");
    editMode.find(".closeEditTask").simulate("click");

    expect(component.state().editMode).toBe(false);
  });

  it("should update task when submitted", () => {
    const mockedUpdate = jest.fn();
    const tasks = [
      { ...props },
      {
        id: "25",
        name: "frontend",
        description: "TODO: blah",
        assignee: "Andy"
      }
    ];
    setGlobal({
      sprints: { currentSprint: { tasks } },
      firebase: { update: mockedUpdate }
    });
    component.setState({ newTaskName: "Mr Blobby", newAssignee: "Mr Blobby" });
    component.instance().onSubmit({ preventDefault: () => {} });

    expect(mockedUpdate).toHaveBeenCalledWith({
      "/sprints/undefined/tasks": [
        {
          assignee: "Mr Blobby",
          description: "TODO: blah",
          id: "24",
          name: "Mr Blobby"
        },
        {
          assignee: "Andy",
          description: "TODO: blah",
          id: "25",
          name: "frontend"
        }
      ]
    });
  });

  it("should delete task when delete button clicked", () => {
    const mockedUpdate = jest.fn();
    const tasks = [
      { ...props },
      {
        id: "25",
        name: "frontend",
        description: "TODO: blah",
        assignee: "Andy"
      }
    ];
    setGlobal({
      sprints: { currentSprint: { tasks } },
      firebase: { update: mockedUpdate }
    });
    component.instance().onDelete();

    expect(mockedUpdate).toHaveBeenCalledWith({
      "/sprints/undefined/tasks": [
        {
          assignee: "Andy",
          description: "TODO: blah",
          id: "25",
          name: "frontend"
        }
      ]
    });
  });
});
