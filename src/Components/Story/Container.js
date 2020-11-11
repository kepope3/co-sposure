import React, { Component } from "reactn";
import Task from "./Task";
import styles from "../../Assets/CSS/container.module.css";
import { sortTask } from "./../Utilities/taskController";

export default class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOnHover: false
    };
  }
  onDrop = e => {
    const { draggedTask, draggedOverTask } = this.global.task;
    if (
      draggedTask &&
      draggedOverTask &&
      draggedTask.id === draggedOverTask.id
    ) {
      e.preventDefault();
      return;
    }

    const { containerType, storyId } = this.props;
    sortTask(containerType, storyId);
    this.setState({ isOnHover: false }); //test
    //update firebase database
  };
  onDragLeave = () => {
    this.setState({ isOnHover: false });
  };
  onDragOver = e => {
    const isOnHoverResult = this.global.task.draggedOverTask ? false : true;
    this.setState({ isOnHover: isOnHoverResult });
    e.preventDefault();
  };

  render() {
    return (
      <div
        className={
          this.state.isOnHover
            ? "col-4 " + [styles.onHover, styles.container].join(" ")
            : "col-4 " + styles.container
        }
        id="container"
        onDrop={this.onDrop}
        onDragLeave={this.onDragLeave}
        onDragOver={this.onDragOver}
      >
        <h3>{this.props.containerType}</h3>
        {this.props.tasks &&
          this.props.tasks.map(task => (
            <Task
              id={task.id}
              name={task.name}
              assignee={task.assignee}
              key={task.id}
            />
          ))}
      </div>
    );
  }
}
