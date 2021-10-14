module.exports = {
  apps: [
    {
      name: "FBTool",
      script: "bin/www",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      //watch: ".",
    }
  ]
};
