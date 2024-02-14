import React from "react";
import styles from "../styles/Home.module.css";

function Project({ index = 0, project = {}, setModal = () => {} }) {
  return (
    <div
      onClick={() => {
        project.onclick();
      }}
      onMouseEnter={() => {
        setModal({ active: true, index });
      }}
      onMouseLeave={() => {
        setModal({ active: false, index });
      }}
      className={styles.project}
    >
      <h2>{project.title}</h2>
      <p>{project.description}</p>
    </div>
  );
}

export default Project;
