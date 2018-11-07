module.exports = function(api) {
  api.cache(false);

  const presets = ["@babel/preset-react", "@babel/preset-env", "@babel/preset-flow"];
  const plugins = [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread"
  ];

  return {
    presets,
    plugins
  };
};
