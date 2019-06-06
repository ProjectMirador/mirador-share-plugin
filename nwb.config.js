module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'MiradorShare',
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
  },
};
