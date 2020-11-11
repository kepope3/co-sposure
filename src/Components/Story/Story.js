import React, { Component } from "reactn";
import Container from "./Container";
import { TODO, IN_PROGRESS, DONE } from "./../../Constants/Task";
import styles from "../../Assets/CSS/story.module.css";
import { setGlobalObject } from "./../../Helpers/global";
import { EDIT_STORY } from "./../../Constants/Modal";

export default class Story extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hide: props.isComplete
    };
    this.ref = React.createRef();
  }
  getTasks = type =>
    this.props.tasks &&
    this.props.tasks.filter(task => task.containerType === type);

  stopBubbling = e => {
    if (!e) e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
  };

  editHandler = e => {
    this.stopBubbling(e);
    setGlobalObject("story", "id", this.props.storyId);
    setGlobalObject("story", "sprint", this.global.sprints.currentSprint);
    setGlobalObject("modal", "mode", EDIT_STORY);
    window.scrollTo(0, 0);
  };
  sortUpHandler = e => {
    this.stopBubbling(e);
    const stories = [...this.global.sprints.currentSprint.stories];
    const sprintKey = this.global.sprints.currentSprint.key;

    let storyIndex;
    var storyToMove;
    stories.forEach((story, index) => {
      if (story.id === this.props.storyId) {
        storyIndex = index;
        storyToMove = story;
      }
    });

    if (storyIndex !== 0) {
      const storyToSwap = { ...stories[storyIndex - 1] };

      stories[storyIndex - 1] = storyToMove;
      stories[storyIndex] = storyToSwap;

      var updates = {};
      updates[`/sprints/${sprintKey}/stories`] = stories;
      this.global.firebase.update(updates);
    }
  };
  sortDownHandler = e => {
    this.stopBubbling(e);
    const stories = [...this.global.sprints.currentSprint.stories];
    const sprintKey = this.global.sprints.currentSprint.key;

    let storyIndex;
    var storyToMove;
    stories.forEach((story, index) => {
      if (story.id === this.props.storyId) {
        storyIndex = index;
        storyToMove = story;
      }
    });

    if (storyIndex + 1 < stories.length) {
      const storyToSwap = { ...stories[storyIndex + 1] };

      stories[storyIndex + 1] = storyToMove;
      stories[storyIndex] = storyToSwap;

      var updates = {};
      updates[`/sprints/${sprintKey}/stories`] = stories;
      this.global.firebase.update(updates);
    }
  };
  newTaskHandler = () => {
    const projectKey = this.global.projects.loaded.key;
    const sprintKey = this.global.sprints.currentSprint.key;
    const tasks = this.global.sprints.currentSprint.tasks
      ? [...this.global.sprints.currentSprint.tasks]
      : [];
    const currentTaskNo = this.global.projects.loaded.currentTaskNo;

    tasks.push({
      id: `t/${currentTaskNo}`,
      storyId: this.props.storyId,
      containerType: TODO
    });

    var updates = {};
    updates[`/sprints/${sprintKey}/tasks`] = tasks;
    updates[`/projects/${projectKey}/currentTaskNo`] = currentTaskNo + 1;
    this.global.firebase.update(updates);
  };

  render() {
    const { storyId, name, points, epicName } = this.props;
    return (
      <div ref={this.ref} className={styles.story}>
        <div
          className={styles.bar}
          id="bar"
          onClick={() => {
            this.setState({ hide: !this.state.hide });
          }}
        >
          <i
            className={"fa fa-edit " + styles.edit}
            onClick={this.editHandler}
          />

          <i
            className={"fa fa-chevron-up " + styles.sortUp}
            onClick={this.sortUpHandler}
          />
          <i
            className={"fa fa-chevron-down " + styles.sortDown}
            onClick={this.sortDownHandler}
          />
          <h4>{`${storyId} - ${name}`}</h4>
          {this.props.isComplete && (
            <i className={"fa fa-check-square " + styles.completed} />
          )}
          <h4 className={styles.points}>{points} points</h4>
          {epicName && <span className={styles.epic}>{epicName}</span>}
        </div>

        <div
          className={
            this.state.hide
              ? "row " + [styles.containers, styles.hide].join(" ")
              : "row " + styles.containers
          }
          id="containers"
        >
          <i
            className={"fa fa-plus " + styles.addNewTask}
            onClick={this.newTaskHandler}
          />
          <Container
            storyId={this.props.storyId}
            containerType={TODO}
            tasks={this.getTasks(TODO)}
          />

          <Container
            storyId={this.props.storyId}
            containerType={IN_PROGRESS}
            tasks={this.getTasks(IN_PROGRESS)}
          />
          <Container
            storyId={this.props.storyId}
            containerType={DONE}
            tasks={this.getTasks(DONE)}
          />
        </div>
      </div>
    );
  }
}
