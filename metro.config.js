const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add XML files to asset extensions
config.resolver.assetExts.push('xml');

module.exports = config;
