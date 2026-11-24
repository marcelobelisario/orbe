const { withAndroidManifest } = require('expo/config-plugins');

module.exports = function withOptionalPortrait(config) {
  return withAndroidManifest(config, (config) => {
    const featureName = 'android.hardware.screen.portrait';
    const manifest = config.modResults.manifest;
    const features = (manifest['uses-feature'] ??= []);
    const portrait = features.find((feature) => feature.$['android:name'] === featureName);

    if (portrait) {
      portrait.$['android:required'] = 'false';
    } else {
      features.push({ $: { 'android:name': featureName, 'android:required': 'false' } });
    }

    return config;
  });
};
