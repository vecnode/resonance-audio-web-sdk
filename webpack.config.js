module.exports = {
  entry: './src/main.js',
  output: {
    path: __dirname + '/build',
    filename: 'resonance-audio.js',
    library: 'ResonanceAudio',
    libraryTarget: 'umd'
  },
};
