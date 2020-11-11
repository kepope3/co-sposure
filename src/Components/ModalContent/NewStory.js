import React, { Component } from "reactn";
import { setGlobalObject } from "./../../Helpers/global";
import { SUCCESS_NEW_STORY } from "./../../Constants/Alerts";

const NameLengthError = "Value has to be atleast five characters in length";
const EnterNameAndDesc = "Please enter a name and description";

const INITIAL_STATE = {
  name: "",
  description: "",
  epicName: "",
  points: 0
};
export default class NewStory extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE, error: EnterNameAndDesc };
  }

  onChange = async event => {
    event.persist();
    await this.setState({ [event.target.name]: event.target.value });

    if (
      event.target.name !== "points" &&
      event.target.name !== "epicName" &&
      event.target.value.length < 5
    )
      this.setState({ error: NameLengthError });
    else if (!this.state.name || !this.state.description)
      this.setState({ error: EnterNameAndDesc });
    else this.setState({ error: null });
  };

  onSubmit = event => {
    event.preventDefault();

    const { name, description, epicName, points } = this.state;

    const sprintKey = this.global.sprints.currentSprint.key;
    const projectKey = this.global.projects.loaded.key;

    let currentStoryNumber = this.global.projects.loaded.currentStoryNo;
    const id = `s/${currentStoryNumber}`;
    const newStory = {
      id,
      name,
      description,
      epicName,
      points
    };
    const stories = this.global.sprints.currentSprint.stories
      ? [...this.global.sprints.currentSprint.stories]
      : [];
    stories.push(newStory);

    var updates = {};
    updates[`/projects/${projectKey}/currentStoryNo`] = currentStoryNumber + 1;
    updates[`/sprints/${sprintKey}/stories`] = stories;

    this.global.firebase
      .update(updates)
      .then(() => {
        setGlobalObject("modal", "mode", null); //test
        setGlobalObject("account", "alert", SUCCESS_NEW_STORY);
      })
      .catch(error => {
        this.setState({ error: error.message });
      });
  };
  render() {
    const { name, description, epicName, points, error } = this.state;
    const isInvalid = name.length < 5 || description.length < 5;
    return (
      <form onSubmit={this.onSubmit}>
        <div className="form-group">
          <h3>Create a new story</h3>
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
        </div>
        {error && <p className="alert alert-danger">{error}</p>}
        <button className="btn btn-primary" disabled={isInvalid} type="submit">
          Create Story
        </button>
      </form>
    );
  }
}
