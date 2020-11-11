import AccountState from "../../GlobalState/AccountState";
import RootState from "../../GlobalState/RootState";
import FirebaseState from "../../GlobalState/FireBaseState";
import ModalState from "../../GlobalState/ModalState";
import ProjectsState from "../../GlobalState/ProjectsState";
import TaskState from "../../GlobalState/TaskState";
import TasksState from "../../GlobalState/TasksState";
import StoryState from "../../GlobalState/StoryState";

jest.mock("../../GlobalState/AccountState");
jest.mock("../../GlobalState/FireBaseState");
jest.mock("../../GlobalState/ModalState");
jest.mock("../../GlobalState/ProjectsState");
jest.mock("../../GlobalState/TaskState");
jest.mock("../../GlobalState/TasksState");
jest.mock("../../GlobalState/StoryState");

describe("RootState", () => {
  RootState();
  it("should include account state", () => {
    expect(AccountState).toHaveBeenCalled();
  });
  it("should include fireBase state", () => {
    expect(FirebaseState).toHaveBeenCalled();
  });
  it("should include fireBase state", () => {
    expect(ModalState).toHaveBeenCalled();
  });
  it("should include fireBase state", () => {
    expect(ProjectsState).toHaveBeenCalled();
  });
  it("should include fireBase state", () => {
    expect(TaskState).toHaveBeenCalled();
  });
  it("should include fireBase state", () => {
    expect(TasksState).toHaveBeenCalled();
  });
  it("should include fireBase state", () => {
    expect(StoryState).toHaveBeenCalled();
  });
});
