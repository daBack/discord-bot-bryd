// Require the necessary discord.js classes
import dotenv from 'dotenv';
dotenv.config();
import { Client, EmbedFieldData, Intents, Interaction, MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { AudioRouter } from './commands/audio';
import { exit } from 'process';
import commands from './utils/slashCommands/Commands';
import { Sounds } from './utils/sounds';
if (!process.env.GUILD_ID_TEST || !process.env.BOT_TOKEN || !process.env.CLIENT_ID) {
  throw new Error('Procces.env keys are not set. Set them up according to the README file found on github');
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
  console.log('Rollin´');
});

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;

  if (commandName.startsWith('play')) {
    AudioRouter(interaction, client);
    return;
  }
  switch (commandName) {
    case 'listclips': {
      const names = getEmbeddedFieldsOfClips();
      const embeded = {
        color: 0x0099ff,
        title: 'Lista av clips',
        fields: names,
      };

      await interaction.reply({
        embeds: [embeded],
      });
      break;
    }
    case 'coffe':
      await interaction.reply(`Wäääääää :woozy_face:`);
      break;
    case 'tekarn':
      await interaction.reply(`HETS! :mechanical_arm:`);
      break;
    case 'guss':
      await interaction.reply(`Köper högt säljer lågt :money_bag:`);
      break;
    case 'jonte':
      await interaction.reply(`Han tycker att alla har NOLL KOLL! :eyes:`);
      break;
    case 'jocke':
      await interaction.reply(`BIRA BIRA BIRA... BÄRS BÄRS BÄRS :beer:`);
      break;
    case 'bäck':
      await interaction.reply(`Han har gjort denhär skitna botten, vilken nörd :man_shrugging:`);
      break;
    default:
      await interaction.reply('Omeh, dehär kommandot finns inte, dumhuvud.. ärthjärna!');
      break;
  }
});

const getEmbeddedFieldsOfClips = (): EmbedFieldData[] => {
  const filedArray = Sounds.map((clip) => {
    const data: EmbedFieldData = { name: clip.name, value: clip.name };
    return data;
  });
  filedArray.unshift({ name: '/clips', value: 'Använd `/clips` i följd av ett clip namn' });
  return filedArray;
};

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);
