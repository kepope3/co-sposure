import React, { Component } from "reactn";
import { Link } from "react-router-dom";
import { SIGN_IN, LANDING } from "./../../Constants/Routes";
import Loading from "./Loading";
import styles from "../../Assets/CSS/layout.module.css";
import SideBar from "./SideBar";
import { setGlobalObject } from "./../../Helpers/global";
import Modal from "./../Shared/Modal";
import Alert from "../Shared/Alert";

export default class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = { isSideBarCollapsed: false };
  }

  render() {
    const signInOrOut = this.global.account.isLoggedIn ? (
      <Link
        to={LANDING}
        onClick={() => {
          setGlobalObject("account", "isLoggedIn", false); //test
          this.global.firebase.doSignOut();
        }}
        id="signOut"
      >
        Sign Out
      </Link>
    ) : (
      <div id="signIn">
        <Link to={SIGN_IN}>Sign In</Link>
      </div>
    );

    const loggedInContent = (
      <div>
        <SideBar
          bodyWidthHandler={() => {
            this.setState({
              isSideBarCollapsed: !this.state.isSideBarCollapsed
            });
          }}
        />
        <div className="row">
          <div
            className={
              this.state.isSideBarCollapsed
                ? `col-11 offset-1 ${styles.childElements}`
                : `col-10 offset-2 ${styles.childElements}`
            }
          >
            <Alert />
            <Modal />
            <div>{this.props.children}</div>
          </div>
        </div>
      </div>
    );

    const resolveMainContent = () => {
      if (
        this.global.account.isLoggedIn &&
        this.global.account.isEmailVerified
      ) {
        return loggedInContent;
      } else if (this.global.account.isLoggedIn) {
        return (
          <div className="container">
            <p id="verifyEmail">
              You should have received an email, please verify your account by
              following the verification link within it.
            </p>
          </div>
        );
      } else {
        return (
          <React.Fragment>
            <h5>Co-Sposure</h5>
            <div id="loggedOutContent" className="container">
              {this.props.children}
            </div>
          </React.Fragment>
        );
      }
    };
    return (
      <div className={styles.layout}>
        <div className={styles.signInOrOut}>{signInOrOut}</div>

        {resolveMainContent()}

        <Loading />
      </div>
    );
  }
}
