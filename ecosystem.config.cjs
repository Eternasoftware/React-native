module.exports = {
  apps: [
    {
      name: "fitflow-showcase",
      script: "http-server",
      args: ["dist", "-l", "5000"],
      watch: false,
    },
  ],
};
