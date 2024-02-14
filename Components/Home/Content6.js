import { CaretRightOutlined } from "@ant-design/icons";
import classNames from "../../styles/Home.module.css";
import HoverButton from "../HoverButton";

const Content6 = () => {
  const connects = [
    {
      name: "Linkedin",
      href: "https://www.linkedin.com/in/madhan-kumar-037174203/",
    },
    // {
    //   name: "Instagram",
    //   href: "",
    // },
    {
      name: "Github",
      href: "https://github.com/Madhan8301/",
    },
  ];

  const contacts = [
    {
      name: "Email",
      value: "madhankumarm8301@gmail.com",
    },
    {
      name: "Phone",
      value: "+91 7708287841",
    },
  ];
  return (
    <div
      style={{
        height: "100%",
        width: "100vw",
        backgroundColor: "#15171B",
        color: "#fff",
        paddingBottom: "10vh",
      }}
      className={classNames.content6}
    >
      <div
        style={{
          width: "80vw",
          marginLeft: "auto",
          marginRight: "auto",
          color: "#B7AB98",
        }}
      >
        <div
          style={{
            textTransform: "uppercase",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 4,
          }}
        >
          Connect
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
          className={classNames.connects}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 15,
            }}
          >
            {connects.map((connect, index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: 10,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    window.open(connect.href, "_blank");
                  }}
                  className={classNames.connect}
                  key={index}
                >
                  <CaretRightOutlined
                    style={{
                      transform: "rotate(-30deg)",
                      color: "#EB5939",
                      fontSize: 20,
                    }}
                  />
                  <HoverButton>
                    <div
                      style={{
                        fontSize: 30,
                        fontWeight: 800,
                        width: "90%",
                        paddingLeft: 5,
                      }}
                    >
                      {connect.name}
                    </div>
                  </HoverButton>
                </div>
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              gap: 15,
            }}
            className={classNames.contacts}
          >
            {contacts.map((contact, idx) => {
              return (
                <HoverButton key={idx}>
                  <div
                    style={{
                      fontSize: 13,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 800,
                      }}
                    >
                      {contact.name}
                    </div>
                    <div
                      style={{
                        color: "",
                      }}
                    >
                      {contact.value}
                    </div>
                  </div>
                </HoverButton>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content6;
