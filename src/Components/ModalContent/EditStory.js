import React, { Component } from "reactn";
import { setGlobalObject } from "./../../Helpers/global";
import {
  SUCCESS_DELETED_STORY,
  SUCCESS_UPDATED_STORY
} from "../../Constants/Alerts";

const NameLengthError = "Value has to be atleast five characters in length";
const EnterNameAndDesc = "Please enter a name and description";

export default class EditStory extends Component {
  constructor(props) {
    super(props);
    this.state = { ...this.setInitialState() };
  }

  componentWillUpdate() {
    if (this.state.id !== this.global.story.id) {
      this.setState(this.setInitialState());
    }
    if (this.state.currentSprintName !== this.global.sprints.currentSprint.name)
      this.setState({
        currentSprintName: this.global.sprints.currentSprint.name,
        currentSprintKey: this.global.sprints.currentSprint.key
      });
  }

  setInitialState = () => {
    const storyId = this.global.story.id;
    const sprintName = this.global.sprints.currentSprint.name;
    const sprintKey = this.global.sprints.currentSprint.key;
    const story = this.global.sprints.currentSprint.stories.filter(
      story => story.id === storyId
    )[0];

    return {
      id: storyId,
      name: story.name,
      description: story.description,
      epicName: story.epicName,
      points: story.points,
      isComplete: story.isComplete ? true : false,
      storySprintKey: this.global.story.sprint.key,
      storySprintName: this.global.story.sprint.name,
      currentSprintName: sprintName,
      currentSprintKey: sprintKey
    };
  };

  onChange = async event => {
    event.persist();
    await this.setState({
      [event.target.name]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value
    });
    if (
      event.target.name !== "points" &&
      event.target.name !== "epicName" &&
      event.target.name !== "isComplete" &&
      event.target.value.length < 5
    )
      this.setState({ error: NameLengthError });
    else if (!this.state.name || !this.state.description)
      this.setState({ error: EnterNameAndDesc });
    else this.setState({ error: null });
  };

  onDelete = () => {
    if (window.confirm("Are you sure you wish to delete this story?")) {
      this.deleteStory();
    }
  };

  deleteStory = (resovePromise = true) => {
    const { id, storySprintKey } = { ...this.state };
    const sprintRef = this.global.firebase.getSprint(storySprintKey);

    setGlobalObject("account", "isLoading", true);
    sprintRef.once("value").then(snapShot => {
      setGlobalObject("account", "alert", SUCCESS_UPDATED_STORY);

      const stories = snapShot.val().stories.reduce((stories, story) => {
        if (story.id !== id) {
          stories.push(story);
        }
        return stories;
      }, []);

      let tasks = snapShot.val().tasks;

      var updates = {};
      updates[`/sprints/${storySprintKey}/stories`] = stories;

      if (tasks) {
        tasks = tasks.reduce((tasks, task) => {
          if (task.storyId !== id) tasks.push(task);

          return tasks;
        }, []);
        updates[`/sprints/${storySprintKey}/tasks`] = tasks;
      }

      if (resovePromise) {
        this.global.firebase
          .update(updates)
          .then(() => {
            setGlobalObject("account", "isLoading", false);
            setGlobalObject("modal", "mode", null);
            setGlobalObject("account", "alert", SUCCESS_DELETED_STORY);
          })
          .catch(error => {
            setGlobalObject("account", "isLoading", false);

            this.setState({ error: error.message });
          });
      } else {
        this.global.firebase.update(updates);
      }
    });
  };

  onSubmit = event => {
    event.preventDefault();
    const {
      id,
      name,
      description,
      epicName,
      points,
      isComplete,
      storySprintKey,
      currentSprintKey,
      currentSprintName,
      storySprintName
    } = this.state;

    const sprintRef = this.global.firebase.getSprint(storySprintKey);

    setGlobalObject("account", "isLoading", true);
    sprintRef.once("value").then(snapShot => {
      var updates = {};

      const stories = snapShot.val().stories.map(story => {
        if (story.id === id) {
          story.name = name;
          story.description = description;
          story.epicName = epicName;
          story.points = points;
          story.isComplete = isComplete;
        }
        return story;
      });

      if (currentSprintName !== storySprintName) {
        const story = stories.filter(story => story.id === id)[0];
        const tasks =
          snapShot.val().tasks &&
          snapShot.val().tasks.filter(task => task.storyId === id);

        const currentStories = this.global.sprints.currentSprint.stories
          ? [...this.global.sprints.currentSprint.stories]
          : [];

        currentStories.push(story);

        updates[`/sprints/${currentSprintKey}/stories`] = currentStories;

        if (tasks) {
          const currentTasks = this.global.sprints.currentSprint.tasks
            ? [...this.global.sprints.currentSprint.tasks]
            : [];

          updates[`/sprints/${currentSprintKey}/tasks`] = currentTasks.concat(
            tasks
          );
        }

        this.deleteStory(false);
      } else {
        updates[`/sprints/${storySprintKey}/stories`] = stories;
      }

      this.global.firebase
        .update(updates)
        .then(() => {
          setGlobalObject("account", "alert", SUCCESS_UPDATED_STORY);
          setGlobalObject("account", "isLoading", false);
          setGlobalObject("modal", "mode", null);
        })
        .catch(error => {
          setGlobalObject("account", "isLoading", false);
          this.setState({ error: error.message });
        });
    });
  };

  render() {
    const {
      id,
      currentSprintName,
      storySprintName,
      name,
      description,
      epicName,
      points,
      isComplete,
      error
    } = this.state;

    const isInvalid = name.length < 5 || description.length < 5;
    return (
      <form onSubmit={this.onSubmit}>
        <div className="form-group">
          <h3>Edit story</h3>
          <h4 className="text-center" id="storySprint">
            Belongs to: <strong>{storySprintName}</strong>
          </h4>

          {currentSprintName !== storySprintName && (
            <h4 className="text-center" id="currentSprint">
              Move to: <strong>{currentSprintName}</strong>
            </h4>
          )}

          <input
            onChange={this.onChange}
            readOnly="readOnly"
            name="id"
            placeholder="id"
            type="text"
            value={id}
            className="form-control"
          />
          <input
            onChange={this.onChange}
            name="name"
            placeholder="Story name"
            type="text"
            value={name}
            className="form-control"
          />
          <textarea
            onChange={this.onChange}
            name="description"
            placeholder="Story description"
            value={description}
            className="form-control"
          />
          <input
            onChange={this.onChange}
            name="epicName"
            placeholder="Epic name (optional)"
            type="text"
            value={epicName}
            className="form-control"
          />
          <input
            onChange={this.onChange}
            name="points"
            placeholder="points (optional)"
            type="number"
            value={points}
            className="form-control"
          />
          <label>
            Has this story been completed?{" "}
            <input
              onChange={this.onChange}
              name="isComplete"
              placeholder="isComplete"
              type="checkbox"
              checked={isComplete}
              className="checkbox"
            />
          </label>
        </div>
        {error && <p className="alert alert-danger">{error}</p>}
        <button className="btn btn-primary" disabled={isInvalid} type="submit">
          Update Story
        </button>
        <button
          className="btn btn-primary"
          type="button"
          onClick={this.onDelete}
        >
          Delete Story
        </button>
      </form>
    );
  }
}
