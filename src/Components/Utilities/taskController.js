import { getGlobal } from "reactn";
import { setGlobalObject } from "./../../Helpers/global";

export const sortTask = (containerType, storyId) => {
  const { draggedTask, draggedOverTask } = getGlobal().task;

  const tasks = [...getGlobal().sprints.currentSprint.tasks];

  let taskIndexToMove;
  let lastTaskWithGivenContainerIdIndex;
  let draggedOverTaskIndex;

  let newTasks = tasks.map((task, index) => {
    if (task.id === draggedTask.id) {
      taskIndexToMove = index;
      task.containerType = containerType;
      task.storyId = storyId;
      return task;
    }
    if (draggedOverTask && draggedOverTask.id === task.id) {
      draggedOverTaskIndex = index;
    }
    if (task.storyId === storyId && task.containerType === containerType) {
      lastTaskWithGivenContainerIdIndex = index;
    }

    return task;
  });

  const newTask = newTasks[taskIndexToMove];

  if (draggedOverTask) {
    newTasks.splice(draggedOverTaskIndex, 0, newTask);
    draggedOverTaskIndex > taskIndexToMove
      ? newTasks.splice(taskIndexToMove, 1)
      : newTasks.splice(taskIndexToMove + 1, 1);
  } else {
    newTasks.splice(taskIndexToMove, 1);
    newTasks.splice(lastTaskWithGivenContainerIdIndex + 1, 0, newTask);
  }

  const sprintKey = getGlobal().sprints.currentSprint.key;
  var updates = {};
  updates[`/sprints/${sprintKey}/tasks`] = newTasks;
  getGlobal().firebase.update(updates);

  setGlobalObject("task", "draggedOverTask", null);
  setGlobalObject("task", "draggedTask", null);
};
