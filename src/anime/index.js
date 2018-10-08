const api = require('../api')

const query = `
query($begin: Int, $end: Int) {
  Page {
    airingSchedules(airingAt_lesser: $end, airingAt_greater: $begin) {
      airingAt
      media {
        siteUrl
        coverImage {
          medium
        }
        title {
          userPreferred
        }
      }
    }
  }
}
`;

const time = {
  begin: Math.floor((new Date().setHours(0,0,0,0)) / 1000),
  end: Math.floor((new Date().setHours(23,59,59,999)) / 1000)
}

var addZero = (i) => {
  if(i < 10){
    i = "0" + i;
  }
  return i;
}

var description = (time, url) => {
  const airing = addZero(time.getHours()) + ":" + addZero(time.getMinutes());
  const description = "Airing: " + airing;
  return description;
}

var search = async () => {
  try {
    const response = await api.anime(query, time);
    const data = response.Page.airingSchedules;
    let anime = [];

    for(let i in data) {
      const media = data[i].media;
      let time = data[i].airingAt * 1000;
      time = new Date(time);
      const title = media.title.userPreferred;
      const image = media.coverImage.medium;
      const url = media.siteUrl;
      anime.push({
        title: title,
        description: description(time, url),
        thumbnail: {
          url: image,
        }
      });
    }
    return anime;
  } catch (error) {
    console.log('Caught', error)
  }

}

module.exports.search = search;