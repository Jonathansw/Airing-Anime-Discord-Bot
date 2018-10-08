const Discord = require('discord.js');
//const config = require('./config.json');

const anime = require('./anime');
const csgo = require('./csgo');

const bot = new Discord.Client();

const help = {
  title: "Commands",
  description: `
    Anime coming out today: !anime or !a
    Pro CSGO matches happening today !csgo
  `
}

const cs = {
  title: "Counter Strike matches today",
  fields: [],
}


bot.on('ready', () => {
  console.log("Bot online");
});

bot.on('message', async (message) => {
  if (message.author.bot) return;
  if(message.content.indexOf(process.env.PREFIX /*|| config.prefix*/) !== 0) return;

  let command = message.content.slice(1).toLowerCase();
  let response = [];
  let matches = [];
  try {
    switch(command) {
      case "help":
        response.push(help)
        break;
      case "a":
      case "airing":
        response = await anime.search();
        break;
      case "csgo":
        matches = await csgo.search();
        cs.fields = matches;
        response.push(cs);
      default:
        break;
    }
    
    for(let i in response) {
      message.channel.send({
        embed: response[i]
      })
    }
  } catch (error) {
    console.log('Caught', error.message)
  }
});

bot.login(process.env.TOKEN /*|| config.token*/);
