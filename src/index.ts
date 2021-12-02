// Require the necessary discord.js classes
import dotenv from 'dotenv';
dotenv.config();
import { Client, Intents, Interaction } from 'discord.js';
import { AudioRouter } from './commands/audio';
import { exit } from 'process';
if (!process.env.GUILD_ID_TEST) {
  exit;
}
// Create a new client instance
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log('Ready! Bryd bot is ready to go');
  console.log(__dirname + '/../assets/');
});

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;

  if (commandName.startsWith('play')) {
    AudioRouter(interaction, client);
    return;
  }
  switch (commandName) {
    case 'coffe':
      await interaction.reply(`Wäääääää`);
      await interaction.followUp('Wääääh wääh Coffe');
      break;
    case 'tekarn':
      await interaction.reply(`HETS!`);
      break;
    default:
      await interaction.reply('Eeh fattar inte..Något e fel, säg till Bäck');
      break;
  }
});

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);
