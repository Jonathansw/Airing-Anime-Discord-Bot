const api = require('../api');
const maps = require('./maps');

//subtract a day 86400000
const time = {
  begin: Math.floor((new Date().setHours(0,0,0,0) - 86400000)),
  end: Math.floor((new Date().setHours(23,59,59,999) - 86400000)),
}

var pro = (league) => {
  const region = (league.indexOf("Europe") > 0 || league.indexOf("North America") > 0);
  return ((league.indexOf("ECS Season") !== -1 || league.indexOf("ESL Pro League") !== -1) && (region));
}

var fields = (csgo) => {
  let output = [];
  if(csgo.length === 0) {
    output.push({
      name: "No ESL/ECS NA or EU games today",
      value: null,
    })
  }
  for(let i in csgo) {
    let field = {};
    let map = csgo[i].map || csgo[i].maps;
    let temp = [];
    for(let j in map) {
      if(map[j] in maps) {
        temp.push(maps[map[j]]);
      } else {
        temp.push([map[j]]);
      }
    }
    field['name'] = csgo[i].team1.name + " vs " + csgo[i].team2.name + " | Maps: [" + temp.toString() + "]";
    field['value'] = csgo[i].event.name;
    output.push(field);
  }
  return output;
}

var search = async () => {
  try {
    const response = await api.csgo();
    let csgo = [];
    for(let i in response) {
      let match = response[i];
      if((match.date >= time.begin && match.date <= time.end) || (match.live)) {
        if(pro(match.event.name)) {
          csgo.push(match);  
        }
      }
    }
    return fields(csgo);
  } catch (error) {
    console.log("Caught: " + error)
  }
}

module.exports.search = search;