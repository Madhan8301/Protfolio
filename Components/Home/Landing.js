import gsap from "gsap";
import { useEffect } from "react";
import SplitType from "split-type";
import classNames from "../../styles/Home.module.css";
import ResumeBtn from "../ResumeBtn";

const Landing = () => {
  useEffect(() => {
    const ourText = SplitType.create("h1", { types: "chars" });
    const chars = ourText.chars;
    gsap.fromTo(
      chars,
      {
        y: 100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.5,
        ease: "power4.out",
      }
    );
    gsap.fromTo(
      "p",
      {
        x: -100,
        opacity: 0,
      },
      {
        delay: 0.5,
        x: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.5,
        ease: "ease.in",
      }
    );
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "80%",
        marginLeft: "auto",
        marginRight: "auto",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        
      }}
      className={classNames["home"]}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          // gap: 20,
          justifyContent: "flex-end",
          
        }}
        className={classNames["homeDiv"]}
      >
        <h1
          style={{
            textTransform: "uppercase",
            fontSize: "clamp(1.5rem, -1.0875rem + 13vw, 5.05rem)",
            fontWeight: "bold",
            color: "#fff",
            wordSpacing: 3,
            fontFamily: "Bebas Neue",
            
          }}
          className={classNames["homeH1"]}
        ><br></br>
          Hi !  i'm Madhan kumar
   
        </h1>
        <p
          style={{
            color: "#ff9900",
            fontSize: 21,
            width: "80%",
            // height: "100%",
          }}
          className={classNames["homePara1"]}
        >
          I have accrued over One+ years of hands on experience as an Automation Test Engineer,
          specializing in Selenium, Java and UiPAth {" "}
        </p>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
        className={classNames["homeDiv1"]}
      >
        <p
          style={{
            color: "#ff9900",
            fontSize: 21,
            width: "80%",
            // height: "100%",
          }}
          className={classNames["homePara2"]}
        >
          I prioritize continuous improvement by actively seeking and
          integrating user feedback for iterative enhancements in my
          projects.
        </p>
        <h1
          style={{
            textTransform: "uppercase",
            fontSize: "clamp(2.1rem, -2.0875rem + 12.5vw, 5.15rem)",
            fontWeight: "bold",
            color: "#fff",
            wordSpacing: 3,
            fontFamily: "Bebas Neue",
            // width:"500%",
          }}
          className={classNames["homeH2"]}
        >
             Automation Test Engineer
        </h1>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <ResumeBtn
          text="Resume"
          onClick={() => {
            window.open("MadhankumarResume.pdf", "_blank");
          }}
        />
      </div>
    </div>
  );
};

export default Landing;
