import Content1 from "./Content1";
import Content2 from "./Content2";
import Content3 from "./Content3";
import Content4 from "./Content4";
import Content5 from "./Content5";
import Content6 from "./Content6";
import Landing from "./Landing";

function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      <Landing />
      <section id="About">
        <Content1 />
      </section>
      <Content2 />
      <section id="Projects">
        <Content3 />
      </section>
      <Content4 />
      <Content5 />
      <section id="Contact">
        <Content6 />
      </section>
    </div>
  );
}

export default Home;
