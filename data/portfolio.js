// All portfolio content lives here — update this file to refresh the site.

export const profile = {
  name: "Madhan Kumar M",
  firstName: "Madhan",
  lastName: "Kumar",
  role: "Automation Test Engineer",
  location: "Coimbatore, India",
  timezone: "Asia/Kolkata",
  email: "reachout.madhan@gmail.com",
  phone: "+91 77082 87841",
  resume: "/MadhankumarResume.pdf",
  linkedin: "https://www.linkedin.com/in/madhan-kumar-037174203/",
  github: "https://github.com/Madhan8301/",
  tagline: ["I break software", { text: "on purpose", em: true }, "— so your users never do."],
  intro:
    "Automation Engineer with 4+ years designing scalable test frameworks for web and mobile. Currently building keyword-driven Playwright MCP suites for No-Code / Low-Code platforms at Rappit.",
  about: {
    lead: "I'm Madhan — an automation engineer who turns slow, fragile, manual regression into fast pipelines that teams actually trust.",
    body: [
      "Over the last 4+ years I've designed Keyword-Driven, Data-Driven and BDD frameworks across Selenium, Playwright, Appium and WebDriverIO, and wired them into Jenkins so every build gets the same scrutiny.",
      "At Rappit I build Playwright MCP automation for complex No-Code / Low-Code workflows, where test cases run straight from Excel or Google Sheets — no code changes needed.",
    ],
  },
  heroStack: ["Playwright", "Selenium", "Appium", "Java", "JavaScript", "Python"],
};

export const stats = [
  { value: 4, suffix: "+", label: "Years automating quality" },
  { value: 6000, suffix: "+", label: "Test cases automated" },
  { value: 95, suffix: "%", label: "Test coverage sustained" },
  { value: 40, suffix: "%", label: "Shorter test cycles" },
];

export const experience = [
  {
    company: "Rappit",
    role: "Automation Test Engineer",
    period: "May 2025 — Present",
    current: true,
    logo: "/assets/rappit.svg",
    url: "https://rappit.io",
    tint: "26, 115, 232",
    summary: "Automating complex No-Code / Low-Code platform workflows with a keyword-driven Playwright MCP framework I designed.",
    metrics: [
      { value: "6000+", label: "test cases for one feature" },
      { value: "50%", label: "less manual validation effort" },
      { value: "40%", label: "shorter regression cycles" },
      { value: "35%", label: "lower maintenance effort" },
    ],
    highlights: [
      "Designed a Keyword-Driven framework with Playwright, JavaScript and MCP — 40% more scalable.",
      "Playwright MCP handles complex UI interactions, dynamic locators and app-state management.",
      "Test cases run from Excel and Google Sheets with zero code changes.",
      "Reusable utilities, custom assertions and central error handling lifted pass reliability 30%.",
      "Automated 6,000+ test cases for a single platform feature.",
      "Built a custom Xray execution report — dashboards, drill-downs, PDF / PNG export and AI fix suggestions.",
      "Logging, screenshots, video and custom reports made failure analysis 25% faster.",
      "Parallel regression strategy that cut the overall test cycle by 40%.",
    ],
    stack: ["Playwright", "Playwright MCP", "JavaScript", "TypeScript", "Xray", "Excel / Google Sheets"],
  },
  {
    company: "KGiSL Technologies",
    role: "Automation Test Engineer",
    period: "Dec 2022 — May 2025",
    logo: "/assets/kgisl.png",
    tint: "255, 176, 32",
    summary: "Built and scaled Selenium, Playwright and WebDriverIO frameworks — including the Alliance Life Insurance suite at 95% coverage.",
    metrics: [
      { value: "50%", label: "faster regression testing" },
      { value: "95%", label: "consistent test coverage" },
      { value: "40%", label: "shorter test cycles" },
    ],
    highlights: [
      "Built a Selenium + Java + Cucumber BDD framework adopted across multiple projects.",
      "Playwright for web and WebDriverIO for mobile — 40% more flexible execution.",
      "A Data-Driven approach that cut maintenance time by 30%.",
      "Robust reporting that made test analysis 25% faster.",
      "Automation suites integrated into CI/CD pipelines for seamless validation.",
      "Champion Award 2024 for building a new automation framework.",
    ],
    stack: ["Selenium", "Java", "Cucumber BDD", "Playwright", "WebDriverIO", "Appium", "UiPath"],
  },
  {
    company: "Cognizant",
    role: "Full Stack Developer — Intern",
    period: "Mar 2022 — Oct 2022",
    logo: "/assets/Cognizant.png",
    tint: "38, 198, 218",
    statement: "Where it started — building both sides of the stack. It's why I test like a developer.",
    highlights: [
      "Worked on full-stack projects across front-end and back-end.",
      "Built dynamic, user-friendly interfaces with HTML, CSS and JavaScript.",
      "Collaborated on milestones, code quality and Git-based workflows.",
      "Hands-on with React, Node.js, Java and Spring Boot.",
    ],
    stack: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Java", "Spring Boot"],
  },
];

// The toolchain band between About and Experience. `logo` is in public/assets/logos, `color` the brand glow.
export const toolchain = [
  [
    { name: "Playwright", logo: "/assets/logos/playwright.svg", kind: "Web", color: "#2EAD33" },
    { name: "Selenium", logo: "/assets/logos/selenium.svg", kind: "Web", color: "#43B02A" },
    { name: "Appium", logo: "/assets/logos/appium.svg", kind: "Mobile", color: "#A46BE8" },
    { name: "WebDriverIO", logo: "/assets/logos/webdriverio.svg", kind: "Mobile", color: "#EA5906" },
    { name: "Cucumber", logo: "/assets/logos/cucumber.svg", kind: "BDD", color: "#23D96C" },
    { name: "TestNG", logo: "/assets/logos/testng.svg", kind: "Runner", color: "#E2483D" },
    { name: "Postman", logo: "/assets/logos/postman.svg", kind: "API", color: "#FF6C37" },
    { name: "UiPath", logo: "/assets/logos/uipath.svg", kind: "RPA", color: "#FA4616" },
  ],
  [
    { name: "Java", logo: "/assets/logos/java.svg", kind: "Language", color: "#F89820" },
    { name: "JavaScript", logo: "/assets/logos/javascript.svg", kind: "Language", color: "#F7DF1E" },
    { name: "TypeScript", logo: "/assets/logos/typescript.svg", kind: "Language", color: "#3178C6" },
    { name: "Python", logo: "/assets/logos/python.svg", kind: "Language", color: "#4B8BBE" },
    { name: "SQL", logo: "/assets/logos/sql.svg", kind: "Data", color: "#00A3BF" },
    { name: "Jenkins", logo: "/assets/logos/jenkins.svg", kind: "CI/CD", color: "#D24939" },
    { name: "GitHub", logo: "/assets/logos/github.svg", kind: "VCS", color: "#E6EDF3" },
    { name: "Jira", logo: "/assets/logos/jira.svg", kind: "Tracking", color: "#2684FF" },
  ],
];

export const languages = ["Java", "JavaScript", "TypeScript", "Python", "SQL"];
export const toolbox = ["Jenkins", "Jira", "Postman", "GitHub", "TestNG", "Cucumber", "UiPath", "Git"];

export const projects = [
  {
    title: "Keyword-Driven Playwright MCP Framework",
    org: "Rappit",
    type: "Framework",
    description:
      "Spreadsheet-driven test execution through Playwright MCP — dynamic locators, custom assertions, video, screenshots and rich reports.",
    tags: ["Playwright", "MCP", "JavaScript"],
    cover: { kind: "sheet" },
  },
  {
    title: "Custom Xray Execution Report",
    org: "Rappit",
    type: "Reporting tool",
    description:
      "A one-file HTML dashboard built from Playwright results and Xray metadata — pass-rate charts, test drill-downs, PDF / PNG export and AI suggestions for failed steps.",
    tags: ["TypeScript", "Playwright", "Xray", "Gemini AI"],
    cover: { kind: "report" },
  },
  {
    title: "Alliance Life Insurance",
    org: "KGiSL Technologies",
    type: "Client project",
    description:
      "End-to-end automation suite with 95% coverage, and a framework evolved with best practices for 30% faster script development.",
    tags: ["Playwright", "Selenium", "Java", "JavaScript"],
    cover: { kind: "shield" },
  },
  {
    title: "ISF Insurance — Selenium",
    org: "Open source",
    type: "Web automation",
    description: "End-to-end automation suite for an insurance platform, built with Selenium and Java.",
    tags: ["Selenium", "Java"],
    link: "https://github.com/Madhan8301/ISF_Insurance_Selenium",
    cover: { kind: "image", src: "/assets/editor.png" },
  },
  {
    title: "Insurance Oracle Forms — UiPath",
    org: "Open source",
    type: "RPA",
    description: "Smoke and sanity automation for Oracle Forms insurance workflows using UiPath.",
    tags: ["UiPath", "RPA"],
    link: "https://github.com/Madhan8301/ISF_Oracle_Forms_UiPath",
    cover: { kind: "image", src: "/assets/Uipath.png" },
  },
  {
    title: "Gesture Virtual Mouse Using AI",
    org: "Published paper",
    type: "Python · AI",
    description: "Controls the cursor with hand gestures via computer vision. Published in GIS Science Journal, April 2022.",
    tags: ["Python", "OpenCV", "MediaPipe"],
    link: "https://github.com/Madhan8301/Virtual-Mouse-Using-AI",
    cover: { kind: "image", src: "/assets/VirtualMouse.png" },
  },
];

// The custom execution report I built at Rappit (Frameworks section showcase).
export const report = {
  name: "Custom Xray Execution Report",
  org: "Rappit",
  period: "2026",
  summary:
    "Playwright's default report didn't speak Jira. So I built one that does — a single, self-contained HTML dashboard generated from Playwright JUnit results and Xray metadata, that the whole team can open, filter and share.",
  features: [
    { title: "Two sources", text: "Report the latest local run, or a whole Xray test plan by its ticket key." },
    { title: "Live dashboard", text: "KPI cards, pass-rate donut by tests or steps, status chart, searchable & sortable table." },
    { title: "Drill-down", text: "Every test with linked Jira keys, steps, test data, screenshots, video and traces." },
    { title: "One-click export", text: "A PNG dashboard snapshot or a detailed PDF of every failure." },
    { title: "AI fix hints", text: "Gemini suggests a fix for each failed step — key kept on a local server, logs redacted." },
    { title: "Light & dark", text: "Themed, branded and filterable without opening a second file." },
  ],
  stack: ["TypeScript", "Playwright", "Xray", "Jira", "Gemini AI", "Node.js"],
};

// Frameworks I've designed and built. `flow` is the architecture, left to right.
export const frameworks = [
  {
    id: "playwright-mcp",
    name: "Keyword-Driven Playwright MCP Framework",
    short: "Playwright MCP",
    org: "Rappit",
    period: "2025 — Present",
    type: "Keyword-driven",
    summary:
      "A spreadsheet-driven framework for complex No-Code / Low-Code platform workflows. Test cases live in Excel or Google Sheets as keywords, and Playwright MCP executes them — so new coverage needs zero code changes.",
    flow: [
      { title: "Excel / Google Sheets", note: "Test cases as keywords" },
      { title: "Keyword engine", note: "Parses & routes steps" },
      { title: "Playwright MCP", note: "Dynamic locators, app state" },
      { title: "Assertions", note: "Custom checks & recovery" },
      { title: "Custom report", note: "Xray · video · AI hints" },
    ],
    features: [
      "Keyword-driven execution from Excel and Google Sheets — no code changes to add or run test cases",
      "Playwright MCP handles complex UI interactions, dynamic locators and application state management",
      "Reusable utilities, custom assertions and centralised error handling",
      "Advanced logging, screenshots, video recording and a custom Xray execution report",
      "Optimised regression strategy with parallel execution",
    ],
    metrics: [
      { value: 40, suffix: "%", label: "more scalable framework" },
      { value: 35, suffix: "%", label: "less maintenance effort" },
      { value: 30, suffix: "%", label: "higher execution success" },
      { value: 40, suffix: "%", label: "shorter test cycle" },
    ],
    stack: ["Playwright", "Playwright MCP", "JavaScript", "Excel", "Google Sheets"],
  },
  {
    id: "selenium-bdd",
    name: "Selenium + Cucumber BDD Framework",
    short: "Selenium BDD",
    org: "KGiSL Technologies",
    period: "2023 — 2025",
    type: "Behaviour-driven",
    summary:
      "A Selenium framework in Java with Cucumber BDD, adopted across multiple projects. Readable Gherkin scenarios for the whole team, backed by reusable page objects and wired into CI/CD.",
    flow: [
      { title: "Gherkin features", note: "Readable scenarios" },
      { title: "Step definitions", note: "Java glue code" },
      { title: "Page objects", note: "Reusable UI layer" },
      { title: "Selenium + TestNG", note: "Cross-browser runs" },
      { title: "Jenkins CI/CD", note: "Reports on every build" },
    ],
    features: [
      "Cucumber BDD scenarios that product, QA and developers can all read",
      "Selenium WebDriver with Java and TestNG for reliable cross-browser runs",
      "Reusable page-object layer shared across projects",
      "Automation suites integrated into CI/CD pipelines",
      "Robust reporting that made test analysis 25% faster",
    ],
    metrics: [
      { value: 50, suffix: "%", label: "less regression time" },
      { value: 95, suffix: "%", label: "consistent coverage" },
      { value: 25, suffix: "%", label: "faster test analysis" },
    ],
    stack: ["Selenium", "Java", "Cucumber", "TestNG", "Jenkins"],
  },
  {
    id: "js-web-mobile",
    name: "JavaScript Web + Mobile Framework",
    short: "Web + Mobile JS",
    org: "KGiSL Technologies",
    period: "2023 — 2025",
    type: "Cross-platform",
    summary:
      "One JavaScript codebase for both platforms — Playwright for web and WebDriverIO with Appium for mobile — sharing utilities, data and reporting.",
    flow: [
      { title: "JS test specs", note: "One language for both" },
      { title: "Shared utilities", note: "Data, helpers, config" },
      { title: "Playwright", note: "Web automation" },
      { title: "WebDriverIO + Appium", note: "Mobile automation" },
      { title: "Unified reports", note: "One view of quality" },
    ],
    features: [
      "Playwright for web and WebDriverIO + Appium for mobile in one framework",
      "Shared helpers and test data across web and mobile suites",
      "Industry best practices that sped up script development by 30%",
      "Integrated reporting across both platforms",
    ],
    metrics: [
      { value: 40, suffix: "%", label: "more flexible execution" },
      { value: 30, suffix: "%", label: "faster script development" },
      { value: "1", suffix: " codebase", label: "for web and mobile" },
    ],
    stack: ["Playwright", "WebDriverIO", "Appium", "JavaScript"],
  },
  {
    id: "data-driven",
    name: "Data-Driven Test Framework",
    short: "Data-Driven",
    org: "KGiSL Technologies",
    period: "2023 — 2025",
    type: "Data-driven",
    summary:
      "Test logic written once and run against many data sets. Inputs live outside the code, so new cases are a data change rather than a script change.",
    flow: [
      { title: "Test data", note: "Excel / external sources" },
      { title: "Data provider", note: "Feeds every iteration" },
      { title: "Reusable test logic", note: "Written once" },
      { title: "Execution", note: "One run per data set" },
      { title: "Results", note: "Per-data-set reports" },
    ],
    features: [
      "Test inputs separated from test logic",
      "One script covers many scenarios through data sets",
      "Easy to extend coverage without touching code",
      "Clear per-data-set results for faster debugging",
    ],
    metrics: [
      { value: 30, suffix: "%", label: "less maintenance time" },
      { value: "1 → N", suffix: "", label: "one script, many data sets" },
    ],
    stack: ["Java", "TestNG", "Excel", "Selenium"],
  },
];

// Achievements dashboard — every number comes from the résumé.
export const impact = {
  // Before → after automation (manual baseline = 100%).
  comparisons: [
    { label: "Manual validation effort", after: 50, where: "Rappit · No-Code / Low-Code workflows" },
    { label: "Regression testing time", after: 50, where: "KGiSL · Selenium + Cucumber BDD" },
    { label: "Overall test cycle time", after: 60, where: "Parallel execution & bottleneck fixes" },
  ],
  testcases: { value: 6000, perDot: 50, where: "Rappit · one platform feature" },
  coverage: { value: 95, where: "Alliance Life Insurance · KGiSL" },
  success: { value: 30, where: "Reusable utilities, custom assertions, central error handling" },
};

export const milestones = [
  { year: "2022", title: "Published research paper", text: "“Gesture Virtual Mouse Using AI” — GIS Science Journal." },
  { year: "2023", title: "ISTQB Foundation", text: "Completed the full Foundation Level training." },
  { year: "2024", title: "Champion Award", text: "KGiSL — for building a new automation framework." },
  { year: "2025", title: "Joined Rappit", text: "Building Playwright MCP automation for No-Code / Low-Code.", current: true },
];

export const award = {
  title: "Champion Award",
  year: "2024",
  org: "KGiSL Technologies",
  detail:
    "Recognised for building a new automation framework that improved execution efficiency by 30%, reduced manual effort by 40% and scaled the testing process.",
};

export const credentials = [
  { type: "Publication", title: "Gesture Virtual Mouse Using AI", issuer: "GIS Science Journal", year: "2022" },
  { type: "Certification", title: "ISTQB Foundation Level — Complete Training", issuer: "Udemy", year: "2023" },
  { type: "Certification", title: "Selenium + Cucumber & TestNG Frameworks", issuer: "Udemy", year: "" },
  { type: "Certification", title: "Postman API Testing", issuer: "Udemy", year: "" },
  {
    type: "Education",
    title: "B.E. Computer Science · CGPA 7.82",
    issuer: "Sri Shakthi Institute of Engineering and Technology",
    year: "2018 — 2022",
  },
];
