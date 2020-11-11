import React, { Component } from "reactn";
import { setGlobalObject } from "./../../Helpers/global";
import { NEW_PROJECT } from "../../Constants/Modal";
import {
  SUCCESS_UPDATED_SPRINT_LENGTH,
  FAILED_UPDATED_SPRINT_LENGTH,
  SUCCESS_ADDED_NEW_MEMBER,
  FAILED_ADDED_NEW_MEMBER,
  SUCCESS_ADDED_REMOVED_MEMBER,
  FAILED_TO_REMOVE_MEMBER,
  SUCCESS_REMOVED_PROJECT,
  FAILED_REMOVED_PROJECT
} from "./../../Constants/Alerts";
import styles from "../../Assets/CSS/admin.module.css";
import { Jumbotron } from "react-bootstrap";

export default class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = { emailAddress: "", selectedMember: "" };
  }

  onChangeSprintLengthHandler = e => {
    const projectKey = this.global.projects.loaded.key;

    var updates = {};
    updates[`/projects/${projectKey}/sprintLength`] = e.target.value;

    this.global.firebase
      .update(updates)
      .then(() => {
        setGlobalObject("account", "alert", SUCCESS_UPDATED_SPRINT_LENGTH);
      })
      .catch(() => {
        setGlobalObject("account", "alert", FAILED_UPDATED_SPRINT_LENGTH);
      });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onRemoveProjectHandler = () => {
    if (window.confirm("Are you sure you wish to delete this project?")) {
      setGlobalObject("account", "isLoading", true);
      const project = this.global.projects.loaded;

      const projectSprints = [...Object.keys(project.sprints)];

      projectSprints.forEach(sprint => {
        this.global.firebase.getSprint(sprint).remove();
      });

      this.global.firebase
        .getProject(project.key)
        .remove()
        .then(() => {
          setGlobalObject("account", "isLoading", false);
          setGlobalObject("account", "alert", SUCCESS_REMOVED_PROJECT);
        })
        .catch(() => {
          setGlobalObject("account", "isLoading", false);
          setGlobalObject("account", "alert", FAILED_REMOVED_PROJECT);
        });
    }
  };

  onRemoveMemberHandler = () => {
    setGlobalObject("account", "isLoading", true);
    const project = this.global.projects.loaded;
    const userId = this.state.selectedMember;

    const projectSprints = [...Object.keys(project.sprints)];

    projectSprints.forEach(sprint => {
      this.global.firebase.getSprintMember(sprint, userId).remove();
    });

    this.global.firebase.getProjectMember(project.key, userId).remove();
    this.global.firebase
      .getSharedMemberProject(userId, project.key)
      .remove()
      .then(() => {
        setGlobalObject("account", "isLoading", false);
        setGlobalObject("account", "alert", SUCCESS_ADDED_REMOVED_MEMBER);
      })
      .catch(() => {
        setGlobalObject("account", "isLoading", false);
        setGlobalObject("account", "alert", FAILED_TO_REMOVE_MEMBER);
      });
  };

  onAddMemberHandler = e => {
    e.preventDefault();
    const emailAddress = this.state.emailAddress;
    if (emailAddress !== this.global.account.user.email) {
      this.global.firebase
        .getUserIdByEmail(emailAddress)
        .once("value")
        .then(snapshot => {
          if (snapshot.val()) {
            setGlobalObject("account", "isLoading", true);
            const project = this.global.projects.loaded;
            const userId = Object.keys(snapshot.val())[0];

            const projectMembers = { ...project.members };
            projectMembers[userId] = Object.values(snapshot.val())[0].name;

            const projectSprints = [...Object.keys(project.sprints)];

            var updates = {};
            updates[`/projects/${project.key}/members`] = projectMembers;
            updates[`/sharedProjects/${userId}/${project.key}`] = project.name;

            projectSprints.forEach(sprintKey => {
              updates[`/sprints/${sprintKey}/members/${userId}`] = userId;
            });

            this.global.firebase
              .update(updates)
              .then(() => {
                setGlobalObject("account", "alert", SUCCESS_ADDED_NEW_MEMBER);
                setGlobalObject("account", "isLoading", false);
                this.setState({ emailAddress: "" });
              })
              .catch(() => {
                setGlobalObject("account", "isLoading", false);
                setGlobalObject("account", "alert", FAILED_ADDED_NEW_MEMBER);
              });
          } else {
            setGlobalObject("account", "alert", FAILED_ADDED_NEW_MEMBER);
          }
        });
    }
  };

  onChangeMembersHandler = event => {
    this.setState({ selectedMember: event.target.value });
  };

  render() {
    const sprintLengthDropdown = () => {
      const sprintLengths = [7, 14, 21, 28];
      const sprintLength =
        this.global.projects.loaded && this.global.projects.loaded.sprintLength;

      return (
        <React.Fragment>
          <select
            id="sprintLength"
            onChange={this.onChangeSprintLengthHandler}
            value={sprintLength ? sprintLength : 7}
          >
            {sprintLengths.map(length => (
              <option key={length} value={length}>
                {`sprint length: ${length}`}
              </option>
            ))}
          </select>
        </React.Fragment>
      );
    };
    const isOwner =
      this.global.projects.loaded &&
      this.global.account.user.projects[this.global.projects.loaded.key].owner;

    const membersList = () => {
      const members = { ...this.global.projects.loaded.members };
      const userId = this.global.account.user.uid;
      const membersArray = Object.values(members).map((member, index) => ({
        name: member,
        id: Object.keys(members)[index]
      }));
      let hasMembers = true;
      return (
        <div className={styles.membersList}>
          <select
            onChange={this.onChangeMembersHandler}
            value={this.state.selectedMember}
            id="membersList"
          >
            <option key={"noneSelected"} value={""}>
              no member selected
            </option>
            {membersArray.reduce((options, member) => {
              if (member.id !== userId) {
                hasMembers = false;
                options.push(
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                );
              }

              return options;
            }, [])}
          </select>
          <button
            className="btn btn-primary"
            disabled={hasMembers || this.state.selectedMember === ""}
            onClick={this.onRemoveMemberHandler}
          >
            Remove member
          </button>
        </div>
      );
    };

    const removeProject = () => (
      <button className="btn btn-primary" onClick={this.onRemoveProjectHandler}>
        Remove project
      </button>
    );

    const projectSettings = () => {
      if (isOwner) {
        return (
          <div className={styles.projectSettings}>
            <h3>Project settings</h3> {sprintLengthDropdown()}
            {addMember()}
            {membersList()}
            {removeProject()}
          </div>
        );
      }
    };

    const addMember = () => {
      const isValidEmail =
        this.state.emailAddress &&
        /(.+)@(.+){2,}\.(.+){2,}/.test(this.state.emailAddress);

      return (
        <form
          className={styles.addMember}
          id="addMember"
          onSubmit={this.onAddMemberHandler}
        >
          <input
            onChange={this.onChange}
            name="emailAddress"
            placeholder="Member's email address"
            type="email"
            value={this.state.emailAddress}
            className="form-control"
          />
          <button
            className="btn btn-primary"
            disabled={!isValidEmail}
            type="submit"
          >
            Add member
          </button>
        </form>
      );
    };
    return (
      <React.Fragment>
        <h1>Admin</h1>
        <Jumbotron>
          <h3>General settings</h3>
          <button
            id="addProject"
            className="btn btn-primary"
            onClick={() => {
              setGlobalObject("modal", "mode", NEW_PROJECT);
            }}
          >
            Create a new project
          </button>
          {projectSettings()}
        </Jumbotron>
      </React.Fragment>
    );
  }
}
