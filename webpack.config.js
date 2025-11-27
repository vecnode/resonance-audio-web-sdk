const OmnitoneExportPlugin = require('./webpack.omnitone-fix.js');

module.exports = {
  entry: './src/main.js',
  output: {
    path: __dirname + '/build',
    filename: 'resonance-audio.js',
    library: 'ResonanceAudio',
    libraryTarget: 'umd'
  },
  plugins: [
    new OmnitoneExportPlugin()
  ]
};
