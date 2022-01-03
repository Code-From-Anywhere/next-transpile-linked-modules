const path = require("path");

const withLinksCreator = (linkableModules) => (nextConfig) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (typeof nextConfig.webpack === "function") {
        config = Object.assign({}, nextConfig.webpack(config, options));
      }

      if (options.isServer) {
        config.externals = ["react", ...config.externals];
      }

      if (process.env.NODE_ENV === "development") {
        config.watchOptions = {
          poll: 2500,
        };
      }

      const aliases = [...linkableModules, "react", "react-dom"].reduce(
        (previous, module) => {
          return {
            ...previous,
            [module]: path.resolve(__dirname, "../..", "node_modules", module),
          };
        },
        {}
      );

      config.resolve.alias = {
        ...config.resolve.alias,
        ...aliases,
      };

      return config;
    },
  });
};

module.exports = withLinksCreator;
