import React, { Component, getGlobal } from "reactn";
import { setGlobalObject } from "./../../Helpers/global";

export default class Listener extends Component {
  componentDidMount() {
    // TODO: test this method

    setGlobalObject("account", "isLoading", true);
    this.global.firebase.auth.onAuthStateChanged(authUser => {
      if (authUser && authUser.emailVerified) {
        this.checkForNewProjects(authUser);
      } else {
        setGlobalObject("account", "isLoading", false);
      }

      setGlobalObject("firebase", "authUser", authUser);
      setGlobalObject("account", "isLoggedIn", authUser);
      setGlobalObject(
        "account",
        "isEmailVerified",
        authUser && authUser.emailVerified
      );
    });
  }

  checkForNewProjects = authUser => {
    this.global.firebase
      .getNewProject(authUser.uid)
      .once("value")
      .then(snapshot => {
        const newProject = snapshot.val();
        if (newProject) {
          this.global.firebase
            .getUser(authUser.uid)
            .once("value")
            .then(snapshot => {
              var updates = {};
              updates[
                `/users/${authUser.uid}/projects/${Object.keys(newProject)[0]}`
              ] = {
                owner: false,
                name: Object.values(newProject)[0],
                key: Object.keys(newProject)[0]
              };

              this.global.firebase.update(updates);
              this.getUser(authUser);
            });

          this.global.firebase.getNewProject(authUser.uid).remove();
        } else {
          this.getUser(authUser);
        }
      })
      .catch(() => {
        this.getUser(authUser);
      });
  };

  getUser = authUser => {
    this.global.firebase.getUser(authUser.uid).on("value", snapshot => {
      if (snapshot.val()) {
        setGlobalObject("account", "user", {
          uid: snapshot.key,
          ...snapshot.val()
        });
        this.getProject(snapshot.val().projects); //test
      } else {
        this.global.firebase
          .getUser(authUser.uid)
          .set({ email: authUser.email });
        setGlobalObject("account", "user", { email: authUser.email });
        setGlobalObject("account", "isLoading", false);
      }
    });
  };

  //test
  getProject = projects => {
    if (projects) {
      const mappedProjects = Object.values(projects).map(project => project);
      setGlobalObject("projects", "list", mappedProjects);
      setProject(mappedProjects[0].key);
    } else {
      setGlobalObject("projects", "loaded", null);
      setGlobalObject("account", "isLoading", false);
    }
  };

  render() {
    return <React.Fragment />;
  }
}
//test
export const setSprint = (sprint, on = true) => {
  setGlobalObject("account", "isLoading", true);
  const sprintRef = getGlobal().firebase.getSprint(sprint);
  on
    ? sprintRef.on("value", snapShot => {
        setGlobalObject("sprints", "currentSprint", {
          key: snapShot.key,
          ...snapShot.val()
        });
        setGlobalObject("account", "isLoading", false);
      })
    : sprintRef.off();
};

export const setProject = (project, on = true) => {
  setGlobalObject("account", "isLoading", true);
  const projectRef = getGlobal().firebase.getProject(project);

  on
    ? projectRef.on(
        "value",
        snapshot => {
          if (snapshot.val()) {
            getGlobal().firebase.setServerTimeValue();

            setGlobalObject("projects", "loaded", {
              key: snapshot.key,
              ...snapshot.val()
            });
            const sprints = snapshot.val().sprints;

            setGlobalObject("account", "isLoading", false);
            if (sprints) {
              const sprintNames = Object.values(sprints);
              const mappedSprints = Object.keys(sprints).map((key, index) => ({
                id: key,
                name: sprintNames[index]
              }));
              setGlobalObject("sprints", "list", mappedSprints);
              setGlobalObject("projects", "loaded", {
                key: snapshot.key,
                ...snapshot.val()
              });
              if (!getGlobal().sprints.currentSprint)
                setSprint(
                  Object.keys(sprints)[Object.keys(sprints).length - 1]
                );
            }
          } else {
            setGlobalObject("projects", "loaded", null);
            setGlobalObject("account", "isLoading", false);
          }
        },
        error => {
          if (error.code === "PERMISSION_DENIED") {
            getGlobal()
              .firebase.getUserProject(getGlobal().account.user.uid, project)
              .remove();
          }
        }
      )
    : projectRef.off();
};
