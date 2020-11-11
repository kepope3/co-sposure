import React, { Component } from "reactn";
import { daysLeftForSprint } from "../Utilities/projectHelper";
import { addNewSprint } from "./../Utilities/projectHelper";
import { setSprint } from "../Utilities/Listener";
import { setGlobalObject } from "../../Helpers/global";
import { NEW_STORY } from "./../../Constants/Modal";
import {
  SUCCESS_NEW_SPRINT,
  FAILED_NEW_SPRINT
} from "./../../Constants/Alerts";
import Story from "../Story/Story";
import styles from "../../Assets/CSS/sprints.module.css";
import { BACKLOG } from "./../ModalContent/NewProject";
import { TODO, IN_PROGRESS, DONE } from "./../../Constants/Task";
import ProgressBar from "./ProgressBar";

export default class Sprints extends Component {
  newSprintHandler = () => {
    const productKey = this.global.projects.loaded.key;
    const uid = this.global.account.user.uid;
    const sprintKey = this.global.sprints.currentSprint.key;
    const updates = { ...addNewSprint(productKey, uid) };
    return this.global.firebase
      .update(updates)
      .then(() => {
        setSprint(sprintKey, false);
        setGlobalObject("account", "alert", SUCCESS_NEW_SPRINT);
        setGlobalObject("account", "isLoading", false);
      })
      .catch(() => {
        setGlobalObject("account", "alert", FAILED_NEW_SPRINT);
      });
  };

  onChangeSprintHandler = e => {
    const currentSprintKey = this.global.sprints.currentSprint.key;
    setSprint(currentSprintKey, false);
    setSprint(e.target.value);
  };

  hasStories =
    this.global.sprints.currentSprint &&
    typeof this.global.sprints.currentSprint.stories === "object";

  render() {
    const stories =
      this.global.sprints.currentSprint &&
      typeof this.global.sprints.currentSprint.stories === "object" &&
      this.global.sprints.currentSprint.stories.map(story => (
        <Story
          key={story.id}
          storyId={story.id}
          name={story.name}
          isComplete={story.isComplete}
          description={story.description}
          epicName={story.epicName}
          points={story.points}
          tasks={
            this.global.sprints.currentSprint.tasks
              ? this.global.sprints.currentSprint.tasks.filter(
                  task =>
                    task.storyId === story.id &&
                    (task.containerType === TODO ||
                      task.containerType === IN_PROGRESS ||
                      task.containerType === DONE)
                )
              : []
          }
        />
      ));

    const hasProjects = this.global.projects && this.global.projects.loaded;
    const sprints = () => {
      const listOfSprints = this.global.sprints.list;
      const currentSprint = this.global.sprints.currentSprint;
      return listOfSprints && currentSprint ? (
        <select
          className={styles.sprintList}
          onChange={this.onChangeSprintHandler}
          value={currentSprint.key}
          id="sprintList"
        >
          {listOfSprints.map(sprint => (
            <option key={sprint.id} value={sprint.id}>
              {sprint.name}
            </option>
          ))}
        </select>
      ) : null;
    };

    const showNewSprintBtn =
      daysLeftForSprint() === 0 &&
      this.global.sprints &&
      this.global.sprints.currentSprint &&
      this.global.sprints.list &&
      this.global.sprints.list[this.global.sprints.list.length - 1].id ===
        this.global.sprints.currentSprint.key;

    const sprintName =
      this.global.sprints &&
      this.global.sprints.currentSprint &&
      this.global.sprints.currentSprint.name;
    return hasProjects ? (
      <div>
        <h1 id="sprintHeading">
          <strong>{sprintName}</strong>
          {sprintName !== BACKLOG &&
            " - " + daysLeftForSprint() + " days remaining."}
        </h1>
        {sprints()}
        <div className={styles.btnWrapper}>
          {showNewSprintBtn && (
            <button
              id="newSprintBtn"
              onClick={this.newSprintHandler}
              className="btn btn-primary"
            >
              Create new sprint
            </button>
          )}
          <button
            onClick={() => {
              setGlobalObject("modal", "mode", NEW_STORY);
            }}
            className="btn btn-primary"
            id="createStory"
          >
            Create new story
          </button>
        </div>

        {stories}

        {this.global.sprints.currentSprint &&
          typeof this.global.sprints.currentSprint.stories === "object" && (
            <ProgressBar stories={this.global.sprints.currentSprint.stories} />
          )}
      </div>
    ) : (
      <div id="noProjects" />
    );
  }
}
