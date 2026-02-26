// /your-monorepo-root/apps/mobile/metro.config.js

const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

// Determine the root of the monorepo
const projectRoot = __dirname;
// Assumes the monorepo root is two levels up from 'apps/mobile'
const workspaceRoot = path.resolve(projectRoot, '../..'); 

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Adjust the asset and module resolver to look in the root node_modules
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'), // App's node_modules
    path.resolve(workspaceRoot, 'node_modules'), // Root node_modules (where hoisted packages live)
];

// 3. Force Metro to resolve (sub)dependencies only from the nodeModulesPaths
// This is essential for preventing resolution errors with hoisted packages.
config.resolver.disableHierarchicalLookup = true;

module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 })
// module.exports = config;