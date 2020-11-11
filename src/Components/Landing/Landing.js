import React, { Component } from "react";
import { Carousel, ListGroup } from "react-bootstrap";
import styles from "./../../Assets/CSS/landing.module.css";
import sprint from "./../../Assets/Images/sprint.JPG";
import backlog from "./../../Assets/Images/backlog.JPG";
import dragAndDrop from "./../../Assets/Images/dragAndDrop.JPG";
import { SignUpLink } from "../SignUp/SignUp";
import { Link } from "react-router-dom";
import { LANDING } from "./../../Constants/Routes";

export default class Landing extends Component {
  render() {
    return (
      <React.Fragment>
        {this.props.location.pathname === "/" ? (
          <div className={styles.landing}>
            <div className={[styles.headingWrapper, styles.section].join(" ")}>
              <h1>Co-Sposure</h1>
              <h2>The lightweight, quirky project management system.</h2>
            </div>
            <div className={styles.section}>
              <h2>Key features...</h2>
              <SignUpLink />
              <ListGroup>
                <ListGroup.Item>It's free!</ListGroup.Item>
                <ListGroup.Item>
                  Drag and drop tasks between states and stories
                </ListGroup.Item>
                <ListGroup.Item>
                  Keep all project members up-to-date with real time updates
                </ListGroup.Item>
                <ListGroup.Item>
                  Swimlane approach with Epics, stories and tasks
                </ListGroup.Item>
                <ListGroup.Item>
                  Prioritise stories and move them around sprints
                </ListGroup.Item>
                <ListGroup.Item>
                  Ability to have multiple projects containing multiple members
                </ListGroup.Item>
                <ListGroup.Item>
                  Enforces good practices by forcing the user to wait until the
                  current sprint has finished, before making a new one
                </ListGroup.Item>
                <ListGroup.Item>
                  Manage and Keep track of work with a simple and intuitive
                  interface
                </ListGroup.Item>
                <ListGroup.Item>And much more...</ListGroup.Item>
              </ListGroup>
            </div>
            <h2>Take a look...</h2>
            <SignUpLink />
            <Carousel
              indicators={false}
              className={[styles.carousel, styles.section].join(" ")}
            >
              <Carousel.Item>
                <img className="d-block w-100" src={sprint} alt="sprint view" />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={backlog}
                  alt="backlog slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={dragAndDrop}
                  alt="dragDrop slide"
                />
              </Carousel.Item>
            </Carousel>
            <div className={styles.section}>
              <h2>Who's it for?</h2>
              <h3>
                Co-Sposure is primarily for software development teams but it is
                flexible and could cater to many different types of people and
                teams.
              </h3>
            </div>
            <div className={styles.section}>
              <h2>About</h2>
              <h3>
                Developed by me, Keith Pope. Visit my website by clicking this
                link{" "}
                <a
                  href="http://www.keithpope.co.uk"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  here
                </a>
                . <br />
                Email me: <a href="mailto:priest3210@gmail.com">Keith Pope</a>
              </h3>
            </div>
            <div className={styles.section}>
              <h2>Privacy and Cookie Policy</h2>
              <h4>Your Privacy and Personal Data</h4>
              <p>
                When entering personal data into any area of our website you can
                be assured that this data is secure and will not be passed on to
                any third parties for any unsolicited purposes.
              </p>
              <p>
                Account log-in details are used only for users to access their
                own account and any information linked to that account, such as
                story and task data. We will not use the e-mail addresses of
                account holders or customers for any marketing purpose.
              </p>
              <h4>Cookies</h4>
              <p>
                Cookies are small data files placed on your computer or device
                by websites.
              </p>
              <p>
                In some cases they are used to track how visitors to our website
                use the site (for example: which pages they visit, how long they
                stay on each page, how they found us etc). This information is
                provided to us through our use of Google Analytics tracking
                cookies, which monitor your visit but do not provide any
                personal details about you – you remain completely anonymous to
                us. This information helps us to monitor the performance of the
                site and make improvements where necessary.
              </p>
              <p>
                Please by assured that all cookies used by co-sposure.com are
                purely to improve the quality of this and future visits to our
                website for both users and ourselves.
              </p>
            </div>

            <div className={styles.section}>
              <h2>Terms & Conditions</h2>
              <p>
                This Agreement documents the legally binding terms and
                conditions attached to the use of the website at co-sposure.com.
                By using or accessing the Site in any way, you are agreeing to
                be bound by these Terms of Service. Please read them carefully.
                Your use of this website indicates your acceptance of these
                terms and conditions. Co-Sposure reserves the right to make
                changes to this website and these terms and conditions at any
                time
              </p>
              <h4>About the Co-Sposure website</h4>
              <p>
                Co-Sposure is a website domain name that is owned and operated
                by Keith Pope. It was designed and developed by Keith Pope only
                and intended to be used as an experimental idea and website,
                rather than a fully-fledged project management system. I, Keith
                Pope, cannot be held responsible for any loss in any form due to
                bugs, or problems with the site.
              </p>

              <h4>Intellectual Property and Site Content</h4>
              <p>
                The site and all of its original content are the sole property
                of Keith Pope and the Co-Sposure website and are, as such, fully
                protected by the appropriate international copyright and other
                intellectual property rights laws.
              </p>
              <p>
                Unless otherwise specified, all content appearing on this
                website, including the text, website design, logos, graphics,
                icons, and images, as well as the arrangement thereof, are the
                sole property of Keith Pope and the Co-Sposure website. All
                software used on the website is the sole property of Keith Pope
                and the Co-Sposure website. No materials from this website may
                be copied, reproduced, modified, republished, uploaded, posted,
                transmitted, or distributed in any form or by any means without
                Keith Pope's prior written permission. All rights not expressly
                granted herein are reserved. Any unauthorised use of the
                materials appearing on this website may violate copyright,
                trademark and other applicable laws and could result in criminal
                or civil penalties.
              </p>
              <h4>Termination</h4>
              <p>
                Keith Pope and the Co-Sposure website reserves the right to
                terminate your access to the Site, without any advance notice.
              </p>
            </div>
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

export const TakeALook = () => (
  <p>
    What is Co-Sposure? <Link to={LANDING}>Take a look!</Link>
  </p>
);
