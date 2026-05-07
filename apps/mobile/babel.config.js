module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',              // 2. Translates the Tailwind CSS
      'react-native-reanimated/plugin' // 3. Translates the animations (MUST BE LAST)
    ],
  };
};