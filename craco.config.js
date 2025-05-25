/**
 * CRACO Configuration for Walknex React Application
 * - Removes source-map-loader warnings from third-party libraries
 * - Ready for extension: aliases, plugins, environment overrides, etc.
 */

const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Remove source-map-loader to suppress noisy source map warnings from dependencies
      webpackConfig.module.rules = webpackConfig.module.rules.filter(
        rule => !(rule.enforce === 'pre' && rule.loader && rule.loader.includes('source-map-loader'))
      );

      // Add custom aliases
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        '@components': path.resolve(__dirname, 'src/components/'),
        '@utils': path.resolve(__dirname, 'src/utils/'),
      };

      // Example: Add custom plugins or modify optimization here

      return webpackConfig;
    },
  },
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      // You can add custom dev server middlewares here if needed
      return middlewares;
    },
    // Enable HTTPS in development
    https: true,
    port: 3000,
    open: true,
  },
  // Add Babel overrides
  babel: {
    plugins: [
      // Example: Add your Babel plugins here
      // '@babel/plugin-proposal-optional-chaining',
    ],
    presets: [
      // Example: Add your Babel presets here
      // '@babel/preset-env',
    ],
  },
  // Add ESLint overrides
  eslint: {
    enable: true,
    mode: "extends",
    configure: {
      // Example: Add your ESLint config here
      rules: {
        // 'no-console': 'warn',
        // 'react/prop-types': 'off',
      },
    },
  },
};