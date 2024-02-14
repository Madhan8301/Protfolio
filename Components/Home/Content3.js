import { downloadZip } from "@/common";
import { useState } from "react";
import styles from "../../styles/Home.module.css";
import Modal from "../Modal";
import Project from "../Project";

const projects = [
  {
    title: "ISF - Insurance",
    color: "#8C8C8C",
    description: "Automation Testing Using Selenium",
    src: "/assets/editor.png",
    onclick: () => {
      window.open("https://github.com/Madhan8301/ISF_Insurance_Selenium", "_blank");
    },
  },
  {
    title: "Insurance Oracle forms Automation",
    color: "gray",
    description: "Automation Testing Using UiPath",
    src: "/assets/Uipath.png",
    onclick: () => {
      window.open("https://github.com/Madhan8301/ISF_Oracle_Forms_UiPath", "_blank");
    },
  },
  {
    title: "Gesture Virtual Mouse Using AI",
    color: "#000000",
    description: "AI/ML(Python) -> Final Year Project",
    src: "/assets/VirtualMouse.png",
    onclick: () => {
      window.open("https://github.com/Madhan8301/Virtual-Mouse-Using-AI", "_blank");
    },
  },

];

function Content3() {
  const [modal, setModal] = useState({
    active: false,
    index: 0,
  });
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: projects.length > 2 ? "20vh" : 0,
        paddingBottom: projects.length > 2 ? "20vh" : 0,
      }}
    >
      <div
        style={{
          width: "80%",
          height: "60%",
        }}
      >
        <div
          style={{
            textTransform: "uppercase",
            fontSize: 20,
            letterSpacing: 6,
            color: "#B7AB8F",
          }}
        >
          Projects
        </div>
        <div className={styles.projects}>
          {projects.map((project, index) => {
            return (
              <Project
                key={index}
                index={index}
                project={project}
                setModal={setModal}
              />
            );
          })}
        </div>
      </div>
      <Modal projects={projects} modal={modal} />
    </div>
  );
}

export default Content3;
