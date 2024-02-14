import useWindowSize from "@rooks/use-window-size";
import { useInView } from "framer-motion";
import Matter from "matter-js";
import { useEffect, useRef } from "react";
import classNames from "../../styles/Home.module.css";

const Content5 = () => {
  const { innerWidth, innerHeight } = useWindowSize();
  const canvasRef = useRef(null);
  const screenRef = useRef(null);
  const isInView = useInView(screenRef, { amount: 0.5 });

  useEffect(() => {
    let Engine = Matter.Engine,
      Render = Matter.Render,
      Events = Matter.Events,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      World = Matter.World,
      Bodies = Matter.Bodies;

    let engine = Engine.create(),
      world = engine.world;

    let render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: innerWidth,
        height: innerHeight,
        pixelRatio: 2,
        background: "#15171B",
        wireframes: false,
      },
    });

    let ground = Bodies.rectangle(
      innerWidth / 2,
      innerHeight + 40,
      innerWidth,
      80,
      {
        isStatic: true,
      }
    );

    let wallLeft = Bodies.rectangle(-40, innerHeight / 2, 80, innerHeight, {
      isStatic: true,
    });

    let wallRight = Bodies.rectangle(
      innerWidth + 40,
      innerHeight / 2,
      80,
      innerHeight,
      {
        isStatic: true,
      }
    );

    let roof = Bodies.rectangle(innerWidth / 2, -40, innerWidth, 80, {
      isStatic: true,
    });

    let bottom = Bodies.rectangle(
      innerWidth / 2 + 160,
      innerHeight + 80,
      innerWidth + 320,
      160,
      { isStatic: true }
    );

    let radius = 20;

    let cucumber = Bodies.rectangle(70, 500, 133, 40, {
      chamfer: { radius: radius },
      render: {
        sprite: {
          texture: "/assets/cucumber.png",
          xScale: 0.5,
          yScale: 0.5,
        },
      },
    });

    let testng = Bodies.rectangle(80, 460, 52, 40, {
      chamfer: { radius: radius },
      render: {
        sprite: {
          texture: "/assets/testng.png",
          xScale: 0.5,
          yScale: 0.5,
        },
      },
    });

    let css = Bodies.rectangle(120, 420, 105, 40, {
      chamfer: { radius: radius },
      render: {
        sprite: {
          texture: "/assets/css.png",
          xScale: 0.5,
          yScale: 0.5,
        },
      },
    });

    let SELENIUM = Bodies.rectangle(200, 460, 56, 40, {
      chamfer: { radius: radius },
      render: {
        sprite: {
          texture: "/assets/SELENIUM.png",
          xScale: 0.5,
          yScale: 0.5,
        },
      },
    });

    let git = Bodies.rectangle(250, 380, 86, 40, {
      chamfer: { radius: radius },
      render: {
        sprite: {
          texture: "/assets/git.png",
          xScale: 0.5,
          yScale: 0.5,
        },
      },
    });

    let github = Bodies.rectangle(220, 540, 165, 40, {
      chamfer: { radius: radius },
      render: {
        sprite: {
          texture: "/assets/github.png",
          xScale: 0.5,
          yScale: 0.5,
        },
      },
    });

    let html = Bodies.rectangle(200, 490, 128, 40, {
      chamfer: { radius: radius },
      render: {
        sprite: {
          texture: "/assets/html.png",
          xScale: 0.5,
          yScale: 0.5,
        },
      },
    });

    let ManualTesting = Bodies.rectangle(180, 440, 104, 40, {
      chamfer: { radius: radius },
      render: {
        sprite: {
          texture: "/assets/ManualTesting.png",
          xScale: 0.5,
          yScale: 0.5,
        },
      },
    });

    let Jira = Bodies.rectangle(170, 390, 82, 40, {
      chamfer: { radius: radius },
      render: {
        sprite: {
          texture: "/assets/Jira.png",
          xScale: 0.5,
          yScale: 0.5,
        },
      },
    });

    let Python = Bodies.rectangle(360, 420, 108, 40, {
      chamfer: { radius: radius },
      render: {
        sprite: {
          texture: "/assets/Python.png",
          xScale: 0.5,
          yScale: 0.5,
        },
      },
    });

    let Java = Bodies.rectangle(300, 380, 92, 40, {
      chamfer: { radius: radius },
      render: {
        sprite: {
          texture: "/assets/Java.png",
          xScale: 0.5,
          yScale: 0.5,
        },
      },
    });

    let ps = Bodies.rectangle(400, 360, 86, 40, {
      chamfer: { radius: radius },
      render: {
        sprite: {
          texture: "/assets/ps.png",
          xScale: 0.5,
          yScale: 0.5,
        },
      },
    });

    let react = Bodies.rectangle(80, 260, 42, 40, {
      chamfer: { radius: radius },
      render: {
        sprite: {
          texture: "/assets/react.png",
          xScale: 0.5,
          yScale: 0.5,
        },
      },
    });

    let Appium = Bodies.rectangle(230, 140, 87, 40, {
      chamfer: { radius: radius },
      render: {
        sprite: {
          texture: "/assets/Appium.png",
          xScale: 0.5,
          yScale: 0.5,
        },
      },
    });

    let AutomationTesting = Bodies.rectangle(320, 180, 40, 40, {
      id: "redux",
      chamfer: { radius: radius },
      render: {
        sprite: {
          texture: "/assets/AutomationTesting.png",
          xScale: 0.5,
          yScale: 0.5,
        },
      },
      // url: "https://www.instagram.com/fuse.blog/",
    });

    let WebTesting = Bodies.rectangle(230, 180, 112, 40, {
      chamfer: { radius: radius },
      render: {
        sprite: {
          texture: "/assets/WebTesting.png",
          xScale: 0.5,
          yScale: 0.5,
        },
      },
    });

    let Postman = Bodies.rectangle(130, 80, 112, 40, {
      chamfer: { radius: radius },
      render: {
        sprite: {
          texture: "/assets/Postman.png",
          xScale: 0.5,
          yScale: 0.5,
        },
      },
    });

    World.add(engine.world, [
      Postman,
      cucumber,
      SELENIUM,
      testng,
      ground,
      wallLeft,
      wallRight,
      roof,
      bottom,
      html,
      ManualTesting,
      css,
      Jira,
      git,
      github,
      Python,
      Java,
      Appium,
      AutomationTesting,
      WebTesting,
      react,
      ps,

    ]);

    let mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        collisionFilter: {
          category: 0x0002,
        },
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      });

    World.add(world, mouseConstraint);

    render.mouse = mouse;

    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

    let click = false;

    document.addEventListener("mousedown", () => (click = true));
    document.addEventListener("mousemove", () => (click = false));
    document.addEventListener("mouseup", () =>
      console.log(click ? "click" : "drag")
    );

    Events.on(mouseConstraint, "mouseup", function (event) {
      let mouseConstraint = event.source;
      let bodies = engine.world.bodies;
      if (!mouseConstraint.bodyB) {
        for (let i = 0; i < bodies.length; i++) {
          let body = bodies[i];
          if (click === true) {
            if (
              Matter.Bounds.contains(
                body.bounds,
                mouseConstraint.mouse.position
              )
            ) {
              let bodyUrl = body.url;
              if (bodyUrl != undefined) {
                window.open(bodyUrl, "_blank");
              }
              break;
            }
          }
        }
      }
    });

    Engine.run(engine);

    Render.run(render);
  }, [isInView]);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
      }}
      ref={screenRef}
    >
      <div
        style={{
          position: "absolute",
          top: "18%",
          left: "6%",
        }}
      >
        <div
          style={{
            textTransform: "uppercase",
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: 6,
            color: "#B7AB8F",
            display: "flex",
            alignItems: "center",
            alignSelf: "center",
            justifyContent: "flex-start",
            width: "90%",
            
          }}
        >
          CERTIFICATIONS
        </div>
        <div
          style={{
            fontFamily: "DM Sans",
            fontWeight: 800,
            fontSize: 30,
            color: "#fff",
            width: "245%",
            marginTop: 20,
          }}
          className={classNames["skillsText"]}
        >
          •  Published Paper of “Gesture Virtual Mouse Using AI “in GIS Science Journal in April2022.<br></br>
          •  Selenium + Cucumber & TestNG Frameworks (Udemy Certifications).<br></br>
          •  Cucumber BDD with Java -Masterclass Selenium Framework (Udemy Certifications).<br></br>
          •  POSTMAN API Testing (Udemy Certifications).<br></br>
          •  ISTQB Foundation Level 2023 Complete Training (Udemy Certifications).
        </div>
      </div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};



export default Content5;
