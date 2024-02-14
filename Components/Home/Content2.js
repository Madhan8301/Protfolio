import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef } from "react";
import styles from "../../styles/Home.module.css";

function Content2() {
  let refs = useRef([]);
  const body = useRef(null);
  const container = useRef(null);
  const sentences =
    "Experienced Automation Test Engineer with more than one year of hands-on expertise in designing, developing, and maintaining the Automated Test Scripts. Proficient in multiple Tools like Selenium, Uipath, Appim and dedicated to writing clean, efficient, and maintainable code.";

  const splitWords = (phrases) => {
    let body = [];
    phrases.split(" ").forEach((word, i) => {
      const letters = splitLetters(word);
      body.push(<p key={word + "_" + i}>{letters}</p>);
    });
    return body;
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(refs.current, {
      scrollTrigger: {
        trigger: container.current,
        scrub: true,
        start: "top 50%",
        bottom: `+=${window.innerHeight / 1.5}`,
      },
      opacity: 1,
      ease: "none",
      stagger: 1,
      duration: 0.2,
    });
  }, []);

  const splitLetters = (word) => {
    let letters = [];
    word.split("").forEach((letter, i) => {
      letters.push(
        <span
          key={letter + "_" + i}
          ref={(el) => {
            refs.current.push(el);
          }}
        >
          {letter}
        </span>
      );
    });

    return letters;
  };
  return (
    <main ref={container} className={styles.content2}>
      <div
        style={{
          textTransform: "uppercase",
          fontSize: 20,
          letterSpacing: 6,
          color: "#B7AB8F",
          display: "flex",
          alignItems: "center",
          alignSelf: "center",
          justifyContent: "flex-start",
          width: "90%",
        }}
      >
        About
      </div>
      <div ref={body} className={styles.content2Body}>
        {splitWords(sentences)}
      </div>
    </main>
  );
}

export default Content2;
