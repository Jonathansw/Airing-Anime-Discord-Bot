const { GraphQLClient } = require('graphql-request');

const client = new GraphQLClient("https://graphql.anilist.co", {
  redirect: "follow"
});

var fetch = (query, variables) => {
  const data = client.request(query, variables)
  return data;
}

module.exports.fetch = fetch