import React, { Component } from "react";
import styles from "../../Assets/CSS/progress.module.css";

export default class ProgressBar extends Component {
  render() {
    const { stories } = { ...this.props };
    const totalPoints = stories.reduce(
      (points, story) => points + Number(story.points),
      0
    );

    const completedPoints = stories.reduce((points, story) => {
      if (story.isComplete) points += Number(story.points);
      return points;
    }, 0);

    const inProgressPoints = stories.reduce((points, story) => {
      if (!story.isComplete) points += Number(story.points);
      return points;
    }, 0);

    const completedPercentage = (completedPoints / totalPoints) * 100;

    const inProgressPercentage = (inProgressPoints / totalPoints) * 100;
    return (
      <React.Fragment>
        <div className={"progress " + styles.progressBar}>
          <div
            className="progress-bar bg-success"
            style={{ width: `${completedPercentage}%` }}
          >
            {completedPoints} points complete
          </div>
          <div
            className="progress-bar bg-warning"
            style={{ width: `${inProgressPercentage}%` }}
          >
            {inProgressPoints} points in progress
          </div>
        </div>
        <h3 id="totalPoints" className={styles.totalPoints}>
          {totalPoints} points in total
        </h3>
      </React.Fragment>
    );
  }
}
