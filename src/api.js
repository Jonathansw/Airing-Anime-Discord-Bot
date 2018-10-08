const { GraphQLClient } = require('graphql-request');
const { HLTV } = require('hltv');

const client = new GraphQLClient("https://graphql.anilist.co", {
  redirect: "follow"
});

var anime = (query, variables) => {
  const data = client.request(query, variables)
  return data;
}

var csgo = async () => {
  try {
    const data = await HLTV.getMatches();
    return data.splice(0,50);
  } catch (error) {
    console.log("Caught: " + error);
  }

}



module.exports = {
  anime,
  csgo
}