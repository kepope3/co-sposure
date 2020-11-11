import React, { Component } from "reactn";
import styles from "../../Assets/CSS/sideBar.module.css";
import { setGlobalObject } from "./../../Helpers/global";
import { NO_ACCOUNT_NAME, NEW_PROJECT } from "./../../Constants/Modal";
import { SPRINTS, ABOUT } from "../../Constants/Routes";
import { Link } from "react-router-dom";
import { ADMIN } from "./../../Constants/Routes";
import { setProject } from "./../Utilities/Listener";

export default class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: false
    };
  }

  toggleHandler = () => {
    this.setState({ isCollapsed: !this.state.isCollapsed });
    this.props.bodyWidthHandler();
  };

  render() {
    return (
      <div
        className={
          this.state.isCollapsed
            ? [styles.sideBar, styles.collapsed].join(" ")
            : styles.sideBar
        }
      >
        <div className={styles.toggleButton}>
          <i
            id="toggleButton"
            onClick={this.toggleHandler}
            className="fa fa-bars"
          />
        </div>
        <h5 className={styles.brand}>Co-Sposure</h5>
        <ul />
        <div id="body" className={styles.body}>
          <AccountSection />
        </div>
      </div>
    );
  }
}

export class AccountSection extends Component {
  onChangeProjectHandler = e => {
    const currentProjectKey = this.global.projects.loaded.key;
    setGlobalObject("sprints", "list", null);
    setGlobalObject("sprints", "currentSprint", null);
    setGlobalObject("modal", "mode", null);

    setProject(currentProjectKey, false);
    setProject(e.target.value);
  };
  render() {
    const usernameContent = () => {
      const username =
        this.global.account.user && this.global.account.user.name;

      if (username) {
        return <p>{username}</p>;
      } else {
        return (
          <p
            onClick={() => {
              setGlobalObject("modal", "mode", NO_ACCOUNT_NAME);
            }}
            style={{ cursor: "pointer" }}
            className="alert alert-danger"
            id="setAccountName"
          >
            Please set an account name
          </p>
        );
      }
    };

    const projects = () => {
      const projectList = this.global.projects.list;
      const projectKey = this.global.projects.loaded.key;
      return (
        <select onChange={this.onChangeProjectHandler} value={projectKey}>
          {projectList &&
            projectList.map(project => (
              <option key={project.key} value={project.key}>
                {project.name}
              </option>
            ))}
        </select>
      );
    };

    const projectContent = () => {
      const loadedProject = this.global.projects.loaded;

      if (loadedProject) {
        return (
          <React.Fragment>
            <div id="projects">{projects()}</div>{" "}
            <div className={styles.btnWrapper}>
              <Link className="btn btn-primary" to={SPRINTS}>
                Backlog - Sprints
              </Link>
              <Link className="btn btn-primary" to={ADMIN}>
                Admin
              </Link>
              <Link className="btn btn-primary" to={ABOUT}>
                About
              </Link>
            </div>
          </React.Fragment>
        );
      } else {
        return (
          <p
            onClick={() => {
              setGlobalObject("modal", "mode", NEW_PROJECT);
            }}
            style={{ cursor: "pointer" }}
            className="alert alert-danger"
            id="addProject"
          >
            Please add a project
          </p>
        );
      }
    };
    return (
      <React.Fragment>
        <h5>Account email:</h5>
        <p id="emailAddress">
          {this.global.account.user && this.global.account.user.email}
        </p>
        <h5>Account name:</h5>
        {usernameContent()}
        <h5>Current project:</h5>
        {projectContent()}
      </React.Fragment>
    );
  }
}
