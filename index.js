const withLinksCreator = (linkableModules) => (nextConfig) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (process.env.NEED_TRANSPILE_LINK_MODULES) {
        if (options.isServer) {
          config.externals = ["react", ...config.externals];
        }

        if (process.env.NODE_ENV === "development") {
          config.watchOptions = {
            poll: 2500,
          };
        }

        config.resolve.alias = {
          ...config.resolve.alias,
          ...[...linkableModules, "react", "react-dom"].reduce(
            (previous, module) => {
              return {
                ...previous,
                [module]: path.resolve(__dirname, ".", "node_modules", module),
              };
            },
            {}
          ),
        };
      }

      if (typeof nextConfig.webpack === "function") {
        config = nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};
