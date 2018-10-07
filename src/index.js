const Discord = require('discord.js');
const config = require('./config.json');

const airing = require('./airing');

const bot = new Discord.Client();

const help = {
  title: "Commands",
  description: `
    Anime coming out today: !today or !t
  `
}


bot.on('ready', () => {
  console.log("Bot online");
});

bot.on('message', async (message) => {
  if (message.author.bot) return;
  if(message.content.indexOf(process.env.PREFIX || config.prefix) !== 0) return;

  let command = message.content.slice(1).toLowerCase();
  let response = [];
  try {
    switch(command) {
      case "help":
        response.push(help)
        break;
      case "t":
      case "today":
        response = await airing.search();
        break;
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

bot.login(process.env.TOKEN || config.token);
