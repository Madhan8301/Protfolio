import Loader from "@/Components/Loader";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import HomePage from "./Home";

export default function Main() {
  const [show, setShow] = useState(true);
  return (
    <>
      <AnimatePresence mode="wait">
        {show ? (
          <Loader
            onLoaded={() => {
              setShow(false);
            }}
          />
        ) : null}
      </AnimatePresence>
      {!show ? <HomePage /> : null}
    </>
  );
  // return show ? (
  //   <HomePage />
  // ) : (
  //   <Loader
  //     onLoaded={() => {
  //       setShow(true);
  //     }}
  //   />
  // );
}
