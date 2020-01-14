const path = require('path');
const { mergeResolvers, fileLoader } = require('merge-graphql-schemas');
const {
  GraphQLDateTime
} = require('graphql-custom-types');

const resolversArray = fileLoader(path.join(__dirname, "./*.resolver.*"));

module.exports = mergeResolvers([...resolversArray, {
  GraphQLDateTime
}]);
