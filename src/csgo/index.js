const api = require('../api');
const maps = require('./maps');

const time = {
  begin: Math.floor((new Date().setHours(0,0,0,0))),
  end: Math.floor((new Date().setHours(23,59,59,999))),
}

var pro = (league) => {
  const region = (league.indexOf("Europe") > 0 || league.indexOf("North America") > 0);
  return ((league.indexOf("ECS Season") !== -1 || league.indexOf("ESL Pro League") !== -1) && (region));
}

var mapCheck = (code) => {
  if(code in maps){
    return maps[code];
  }
  return code;
}

var fields = (csgo) => {
  let output = [];
  if(csgo.length === 0) {
    output.push({
      name: "No ESL/ECS NA or EU games today",
      value: "Try again tomorrow",
    })
  }
  for(let i in csgo) {
    let field = {};
    let map = csgo[i].map || csgo[i].maps;
    let mapTemp = [];
    if(Array.isArray(map)) {
      for(let j in map) {
        mapTemp.push(mapCheck(map[j]));
      }
    } else {
      mapTemp.push(mapCheck(map));
    }
    field['name'] = csgo[i].team1.name + " vs " + csgo[i].team2.name + " | Maps: [" + mapTemp.toString() + "]";
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