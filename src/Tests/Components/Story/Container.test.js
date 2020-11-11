import Container from "./../../../Components/Story/Container";
import { shallow } from "enzyme";
import React from "react";
import Task from "./../../../Components/Story/Task";
import { setGlobal, getGlobal } from "reactn";
import { TODO, DONE, IN_PROGRESS } from "./../../../Constants/Task";

describe("Container", () => {
  const props = {
    containerType: TODO,
    storyId: "jfjld",
    tasks: [
      {
        id: 23,
        storyId: "jfjld",
        containerType: TODO,
        name: "QA",
        assignee: "keith"
      },
      {
        id: 24,
        storyId: "jfjld",
        containerType: TODO,
        name: "frontend",
        assignee: "Andy"
      },
      {
        id: 25,
        storyId: "pie",
        containerType: IN_PROGRESS,
        name: "QA",
        assignee: "Paul"
      },
      {
        id: 26,
        storyId: "eat",
        containerType: DONE,
        name: "frontend",
        assignee: "John"
      }
    ]
  };
  let component;
  beforeEach(() => {
    component = shallow(<Container {...props} />);
  });
  it("should have an id and tasks by props", () => {
    expect(component.instance().props.id).toBe(props.id);
    expect(component.instance().props.tasks).toBe(props.tasks);
  });
  it("should have a col-4", () => {
    expect(component.find(".col-4")).toHaveLength(1);
  });

  it("should render all tasks in container with props", () => {
    expect(component.find(Task)).toHaveLength(props.tasks.length);
    expect(component.find(Task).get(0).props.id).toBe(props.tasks[0].id);
    expect(component.find(Task).get(0).props.name).toBe(props.tasks[0].name);
    expect(component.find(Task).get(0).props.assignee).toBe(
      props.tasks[0].assignee
    );
  });

  it("should have onDrop, ondragleave and ondragover events and handlers", () => {
    const dropHandler = component.instance().onDrop;
    expect(component.find("#container").prop("onDrop")).toBe(dropHandler);

    const onDragLeaveHandler = component.instance().onDragLeave;
    expect(component.find("#container").prop("onDragLeave")).toBe(
      onDragLeaveHandler
    );

    const onDragOverHandler = component.instance().onDragOver;
    expect(component.find("#container").prop("onDragOver")).toBe(
      onDragOverHandler
    );
  });

  describe("drop handler", () => {
    it("should remove className for onHoverContainer class", () => {
      expect(component.find("#container").prop("className")).not.toContain(
        "onHoverContainer"
      );
    });
    it("should drop in at the end of the dragged over container if not dragged over another task", () => {
      const mockedUpdate = result => {
        setGlobal({
          currentSprint: { tasks: result["/sprints/undefined/tasks"] }
        });
      };
      setGlobal({
        firebase: { update: mockedUpdate },
        task: { draggedOverTask: null, draggedTask: props.tasks[3] },
        sprints: { currentSprint: { tasks: [...props.tasks] } }
      });
      component.setState({ isOnHover: true });
      component.instance().onDrop();

      expect(getGlobal().task.draggedTask).toBe(null);
      expect(getGlobal().task.draggedOverTask).toBe(null);

      expect(getGlobal().currentSprint.tasks[2].id).toBe(props.tasks[3].id);
      expect(getGlobal().currentSprint.tasks[3].id).toBe(props.tasks[2].id);
      expect(getGlobal().currentSprint.tasks[2].containerType).toBe(
        component.instance().props.containerType
      );
      expect(getGlobal().currentSprint.tasks[2].storyId).toBe(
        component.instance().props.storyId
      );
      expect(component.state().isOnHover).toBe(false);
    });

    it("should not perform on drop logic if draggedOver task is the same as the dragged task", () => {
      const preventDefault = jest.fn();
      setGlobal({
        task: { draggedOverTask: { id: 1 }, draggedTask: { id: 1 } },
        sprints: { currentSprint: { tasks: [...props.tasks] } }
      });
      component.setState({ isOnHover: true });
      component.instance().onDrop({ preventDefault });

      expect(component.state().isOnHover).toBe(true);
      expect(preventDefault).toHaveBeenCalled();
    });

    it("should drop in before draggedOverTask if dragging over another task", () => {
      const mockedUpdate = result => {
        setGlobal({
          currentSprint: { tasks: result["/sprints/undefined/tasks"] }
        });
      };
      setGlobal({
        firebase: { update: mockedUpdate },
        task: { draggedOverTask: props.tasks[0], draggedTask: props.tasks[3] },
        sprints: { currentSprint: { tasks: [...props.tasks] } }
      });

      component.instance().onDrop();

      expect(getGlobal().task.draggedTask).toBe(null);
      expect(getGlobal().task.draggedOverTask).toBe(null);

      expect(getGlobal().currentSprint.tasks[0].id).toBe(props.tasks[3].id);
      expect(getGlobal().currentSprint.tasks[0].containerId).toBe(
        props.tasks[0].containerId
      );
      expect(getGlobal().currentSprint.tasks[1].id).toBe(props.tasks[0].id);
      expect(getGlobal().currentSprint.tasks.length).toBe(4);
    });

    it("should drop in before draggedOverTask if dragging over another task (different setup)", () => {
      const mockedUpdate = result => {
        setGlobal({
          currentSprint: { tasks: result["/sprints/undefined/tasks"] }
        });
      };
      setGlobal({
        firebase: { update: mockedUpdate },
        task: { draggedOverTask: props.tasks[2], draggedTask: props.tasks[0] },
        sprints: { currentSprint: { tasks: [...props.tasks] } }
      });
      component.instance().onDrop();

      expect(getGlobal().currentSprint.tasks[0].id).toBe(props.tasks[1].id);
      expect(getGlobal().currentSprint.tasks[1].id).toBe(props.tasks[0].id);

      expect(getGlobal().currentSprint.tasks[2].id).toBe(props.tasks[2].id);
    });

    it("should remove onhover class on drag leave", () => {
      component.instance().setState({ isOnHover: true });
      component.instance().onDragLeave();

      expect(component.state().isOnHover).toBe(false);
    });

    it("should add onhover class if dragged over container and task not set", () => {
      setGlobal({
        task: { draggedOverTask: null }
      });
      component.instance().setState({ isOnHover: false });
      component.instance().onDragOver({ preventDefault: () => {} });

      expect(component.state().isOnHover).toBe(true);
    });

    it("should remove onhover class if dragged over container and task set", () => {
      setGlobal({
        task: { draggedOverTask: props.tasks[0] }
      });
      component.instance().setState({ isOnHover: true });
      component.instance().onDragOver({ preventDefault: () => {} });

      expect(component.state().isOnHover).toBe(false);
    });

    it("should have class onhover if onhover state is set to true", () => {
      component.instance().setState({ isOnHover: true });

      expect(component.find("#container").prop("className")).toContain(
        "onHover"
      );
    });

    it("should not have class onhover if onhover state is set to false", () => {
      component.instance().setState({ isOnHover: false });

      expect(component.find("#container").prop("className")).not.toContain(
        "onHover"
      );
    });
  });
});
