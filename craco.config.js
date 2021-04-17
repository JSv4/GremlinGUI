module.exports = {
  plugins: [
    { 
      plugin: require('@semantic-ui-react/craco-less') 
    },
    {
      plugin: require('craco-plugin-scoped-css'),
    },
  ],
}