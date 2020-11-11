import React, { Component } from "reactn";
import { setGlobalObject } from "./../../Helpers/global";
import { SUCCESS_NEW_PROJECT } from "./../../Constants/Alerts";
import { addNewSprint } from "./../Utilities/projectHelper";
const NameLengthError =
  "name has to be between five and twenty characters in length";
const INITIAL_STATE = {
  name: "",
  error: null
};
export const BACKLOG = "Backlog";

export default class NewProject extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    if (event.target.value.length > 4 && event.target.value.length < 21)
      this.setState({ error: null });
    else this.setState({ error: NameLengthError });
  };

  onSubmit = event => {
    event.preventDefault();

    const uid = this.global.firebase.authUser.uid;

    var newProjectKey = this.global.firebase.getProjects.push().key;

    var updates = {};
    updates[`/projects/${newProjectKey}/members/${uid}`] = uid;
    updates[`/projects/${newProjectKey}/currentSprintNo`] = 1;
    updates[`/projects/${newProjectKey}/currentTaskNo`] = 1;
    updates[`/projects/${newProjectKey}/currentStoryNo`] = 1;
    updates[`/projects/${newProjectKey}/sprintLength`] = 7;
    updates[`/projects/${newProjectKey}/name`] = this.state.name;
    updates[
      `/projects/${newProjectKey}/creationDate`
    ] = this.global.firebase.getServerTime;
    updates[`/users/${uid}/projects/${newProjectKey}`] = {
      owner: true,
      name: this.state.name,
      key: newProjectKey
    };

    updates = {
      ...updates,
      ...addNewSprint(newProjectKey, uid, BACKLOG),
      ...addNewSprint(newProjectKey, uid, 1)
    };

    this.global.firebase
      .update(updates)
      .then(() => {
        setGlobalObject("modal", "mode", null);
        setGlobalObject("account", "alert", SUCCESS_NEW_PROJECT);
      })
      .catch(error => {
        this.setState({ error: error.message });
      });
  };

  render() {
    const { name, error } = this.state;
    const isInvalid = name.length < 5 || name.length > 19;
    return (
      <React.Fragment>
        <form onSubmit={this.onSubmit}>
          <h3>Create a new project</h3>
          <div className="form-group">
            <input
              onChange={this.onChange}
              name="name"
              placeholder="Project Name"
              type="text"
              value={name}
              className="form-control"
            />
          </div>
          {error && <p className="alert alert-danger">{error}</p>}
          <button
            className="btn btn-primary"
            disabled={isInvalid}
            type="submit"
          >
            Set Name
          </button>
        </form>
      </React.Fragment>
    );
  }
}
