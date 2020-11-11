import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { setGlobal } from "reactn";
import firebaseConfig from "../Config/firebaseConfig";
import { setGlobalObject } from "./../Helpers/global";

export default () => {
  app.initializeApp(firebaseConfig);
  const auth = app.auth();
  const db = app.database();
  const ServerValueTimeStamp = app.database.ServerValue.TIMESTAMP;

  setGlobal({
    firebase: {
      doCreateUserWithEmailAndPassword: (email, password) =>
        auth.createUserWithEmailAndPassword(email, password),

      doSignInWithEmailAndPassword: (email, password) =>
        auth.signInWithEmailAndPassword(email, password),

      doSignOut: () => {
        setGlobalObject("account", "isLoading", true);
        auth.signOut().then(() => {
          window.location.reload();
          setGlobalObject("account", "isLoading", false);
        });
      },

      doSendResetPasswordEmail: email => auth.sendPasswordResetEmail(email),

      auth,

      authUser: null,

      getUser: uid => db.ref(`users/${uid}`),

      getUserProject: (uid, projectKey) =>
        db.ref(`users/${uid}/projects/${projectKey}`),

      getNewProject: uid => db.ref(`sharedProjects/${uid}`),

      getUserRef: email =>
        db
          .ref("users")
          .orderByChild("email")
          .equalTo(email),

      getProject: projectId => db.ref(`projects/${projectId}`),

      getSharedMemberProject: (memberId, projectId) =>
        db.ref(`sharedProjects/${memberId}/${projectId}`),

      getProjectMember: (projectId, memberId) =>
        db.ref(`projects/${projectId}/members/${memberId}`),

      getSprintMember: (sprintId, memberId) =>
        db.ref(`sprints/${sprintId}/members/${memberId}`),

      getSprints: db.ref("sprints/"),

      getSprint: sprintId => db.ref(`sprints/${sprintId}`),

      getUserIdByEmail: email =>
        db
          .ref("users")
          .orderByChild("email")
          .equalTo(email),

      getProjects: db.ref("projects/"),

      getServerTime: ServerValueTimeStamp,

      setServerTimeValue: () => {
        const ref = db.ref("serverTime/");
        ref.set({ time: ServerValueTimeStamp });
        ref.on("value", snapshot => {
          setGlobalObject("account", "serverTime", snapshot.val());
        });
      },

      update: updates => db.ref().update(updates)
    }
  });
};
