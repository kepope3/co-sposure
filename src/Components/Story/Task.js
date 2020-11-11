import React, { Component } from "reactn";
import { setGlobalObject } from "./../../Helpers/global";
import styles from "../../Assets/CSS/task.module.css";

const AssigneeLengthError =
  "Assignee has to be between two and one hundred characters in length";
const EnterTaskName =
  "Please enter a task name between two and one hundred characters in length";
export default class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      newTaskName: this.props.name ? this.props.name : "",
      newAssignee: this.props.assignee ? this.props.assignee : "",
      error: !this.props.name && EnterTaskName
    };
  }
  dragStart = e => {
    e.dataTransfer.setData(e.target.id, e.target.id);
    setGlobalObject("task", "draggedTask", { id: this.props.id });
  };

  dragLeave = () => {
    setGlobalObject("task", "draggedOverTask", null);
  };

  dragOver = () => {
    setGlobalObject("task", "draggedOverTask", { id: this.props.id });
  };

  editHandler = e => {
    if (!e) e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();

    this.setState({ editMode: !this.state.editMode });
  };

  onChange = async event => {
    await this.setState({
      [event.target.name]: event.target.value
    });

    const { newTaskName, newAssignee } = { ...this.state };

    if (
      (newAssignee !== "" && newAssignee.length < 2) ||
      newAssignee.length > 100
    )
      this.setState({ error: AssigneeLengthError });
    else if (newTaskName.length < 2 || newTaskName.length > 100)
      this.setState({ error: EnterTaskName });
    else this.setState({ error: null });
  };

  onSubmit = event => {
    event.preventDefault();
    const { newTaskName, newAssignee } = { ...this.state };

    const tasks = [...this.global.sprints.currentSprint.tasks];

    const thisTask = tasks.find(task => task.id === this.props.id);
    thisTask.name = newTaskName;
    thisTask.assignee = newAssignee;

    this.updateFirebase(tasks);
    this.setState({ editMode: !this.state.editMode });
  };

  onDelete = () => {
    const tasks = [...this.global.sprints.currentSprint.tasks].reduce(
      (tasks, task) => {
        if (task.id !== this.props.id) tasks.push(task);
        return tasks;
      },
      []
    );

    this.updateFirebase(tasks);
    this.setState({ editMode: !this.state.editMode });
  };

  updateFirebase = tasks => {
    const sprintKey = this.global.sprints.currentSprint.key;
    var updates = {};
    updates[`/sprints/${sprintKey}/tasks`] = tasks;
    this.global.firebase.update(updates);
  };

  render() {
    const { name, assignee, id } = { ...this.props };
    const { newTaskName, newAssignee, error } = { ...this.state };

    const task = (
      <div
        className={styles.task}
        id="task"
        draggable="true"
        onDragStart={this.dragStart}
        onDragLeave={this.dragLeave}
        onDragOver={this.dragOver}
      >
        <i className="fa fa-edit" onClick={this.editHandler} />
        <div className={styles.content}>
          <p>{id}</p>
          <p>{name}</p>
          <p>{assignee}</p>
        </div>
      </div>
    );

    const editModeTask = (
      <div className={styles.editModeTask}>
        <i
          id="close"
          className={"fa fa-times " + styles.closeEditTask}
          onClick={() => {
            this.setState({ editMode: false });
          }}
        />
        <p>{id}</p>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <input
              onChange={this.onChange}
              name="newTaskName"
              placeholder="Task name"
              type="text"
              value={newTaskName}
              className="form-control"
            />
            <input
              onChange={this.onChange}
              name="newAssignee"
              placeholder="Task assignee"
              type="text"
              value={newAssignee}
              className="form-control"
            />
          </div>
          {error && <p className="alert alert-danger">{error}</p>}
          <button className="btn btn-primary" disabled={error} type="submit">
            Update Task
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={this.onDelete}
          >
            Delete Task
          </button>
        </form>
      </div>
    );

    return (
      <React.Fragment>
        {this.state.editMode ? editModeTask : task}
      </React.Fragment>
    );
  }
}
