import AccountState from "./AccountState";
import FirebaseState from "./FireBaseState";
import ModalState from "./ModalState";
import ProjectsState from "./ProjectsState";
import TaskState from "./TaskState";
import TasksState from "./TasksState";
import StoryState from "./StoryState";

export default () => {
  AccountState();
  FirebaseState();
  ModalState();
  ProjectsState();
  TaskState();
  TasksState();
  StoryState();
};
