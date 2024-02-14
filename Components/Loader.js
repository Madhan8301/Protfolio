import { slideUp } from "@/common/anim";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import classNames from "../styles/Loader.module.css";
import Button from "./Button";

const Loader = ({ onLoaded = () => {} }) => {
  const [showLoader, setShowLoader] = useState(false);

  setTimeout(() => {
    setShowLoader(true);
    // onLoaded();
  }, 3000);

  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } Q${dimension.width / 2} ${dimension.height + 300} 0 ${
    dimension.height
  }  L0 0`;

  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height}  L0 0`;

  const curve = {
    initial: {
      d: initialPath,

      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
    },

    exit: {
      d: targetPath,

      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 },
    },
  };
  return (
    // <motion.div
    //   variants={slideUp}
    //   initial="initial"
    //   exit="exit"
    //   style={{
    //     height: "100vh",
    //     width: "100vw",
    //     backgroundColor: "#000",
    //     display: "flex",
    //     flexDirection: "column",
    //     justifyContent: "center",
    //     alignItems: "center",
    //   }}
    // >
    //   <img src="/assets/loader.gif" />
    //   {!showLoader ? (
    //     <div className={classNames["loader"]}></div>
    //   ) : (
    //     <Button
    //       onButtonClick={() => {
    //         onLoaded();
    //       }}
    //     />
    //   )}
    // </motion.div>

    <motion.div
      variants={slideUp}
      initial="initial"
      exit="exit"
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        zIndex: 99,
        backgroundColor: "#000",
      }}
    >
      {dimension.width > 0 && (
        <>
          <div
            style={{
              zIndex: 100,
              fontSize: 100,
            }}
          >
            <img src="/assets/Walk.gif" />
            {/* <img src="/assets/loader.gif" /> */}
            {/* <img src="/assets/Skateboarding.gif" /> */}
            {!showLoader ? (
              <div className={classNames["loader"]}></div>
            ) : (
              <Button
                onButtonClick={() => {
                  onLoaded();
                }}
              />
            )}
          </div>
          <svg
            style={{
              position: "absolute",
              top: 0,
              width: "100%",
              height: "calc(100% + 300px)",
            }}
          >
            <motion.path
              style={{
                fill: "#000",
              }}
              variants={curve}
              initial="initial"
              exit="exit"
            ></motion.path>
          </svg>
        </>
      )}
    </motion.div>
  );
};

export default Loader;
