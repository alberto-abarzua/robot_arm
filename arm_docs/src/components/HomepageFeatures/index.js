const FeatureList = [
  {
    title: "Easy to Use",
    Svg: require("@site/static/img/exp.svg").default,
    description: (
      <>
        Powerfull User Interface that allows you to control your robot arm with
        just a few clicks.
      </>
    ),
  },
  {
    title: "Controller Library",
    Svg: require("@site/static/img/python.svg").default,
    description: (
      <>
        There is space for growth, first learn the GUI and then use the
        controller library to control your robot arm from your own code.
      </>
    ),
  },
  {
    title: "Focus on What Matters",
    Svg: require("@site/static/img/docker.svg").default,
    description: (
      <>
        Powered by Docker, RiBot allows you to focus on your robot arm and not
        the infrastructure.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className="flex flex-col w-10/12 rounded-md shadow-gray-300 shadow-sm border  border-gray-400 px-4 py-3 m-4">
      <div className="flex items-center justify-center">
        <Svg className="h-40 w-full" role="img" />
      </div>
      <div className="text-center flex-wrap">
        <h3 className="text-xl font-bold">{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section>
      <div className="flex gap-5 w-full">
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}
