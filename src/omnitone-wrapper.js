/**
 * @file Wrapper for Omnitone to ensure proper CommonJS export.
 * The omnitone.js file is an IIFE that returns Omnitone but doesn't export it.
 * This wrapper ensures webpack can properly bundle it.
 */


const Omnitone = require('../node_modules/omnitone/build/omnitone.js');
module.exports = Omnitone;

