// Require the necessary discord.js classes
import dotenv from 'dotenv';
dotenv.config();
import {
  Client,
  CommandInteraction,
  EmbedFieldData,
  Intents,
  Interaction,
  MessageEmbed,
  MessageEmbedOptions,
} from 'discord.js';
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

  /**
   * Plays specific sound on search
   */
  if (commandName.startsWith('play')) {
    AudioRouter(interaction, client);
    return;
  }
  switch (commandName) {
    /**
     * Lists the viable clips
     */
    case 'listclips': {
      const names = getEmbeddedFieldsOfClips();
      console.log(names.length / 25);

      const embeded = {
        color: 0x0099ff,
        title: 'Lista av clips',
        fields: names,
      };

      await interaction.reply({
        embeds: [embeded],
      });
      await getFollowUpMessage(interaction, names);

      break;
    }
    case 'coffe':
      await interaction.reply(`Wäääääää :woozy_face:`);
      break;
    case 'tekarn':
      await interaction.reply(`HETS! :mechanical_arm:`);
      break;
    case 'guss':
      await interaction.reply(`Köper högt säljer lågt :moneybag:`);
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

const getFollowUpMessage = async (interaction: CommandInteraction, names) => {
  let newNamesList: EmbedFieldData[] = [];
  if (names.length / 25 > 1) {
    console.log(names);

    newNamesList = names.slice(25, -1);
    console.log(newNamesList);

    if (newNamesList.length / 25 > 1) {
      getFollowUpMessage(interaction, newNamesList);
    } else {
      await interaction.followUp({
        embeds: [
          {
            color: 0x0099ff,
            title: 'Mer clips...',
            fields: newNamesList,
          },
        ],
      });
    }
  }
};

const getEmbeddedFieldsOfClips = (): EmbedFieldData[] => {
  const filedArray = Sounds.map((clip) => {
    const data: EmbedFieldData = { name: clip.name, value: '_____', inline: true };
    return data;
  });
  filedArray.unshift({ name: '/clips', value: 'Använd `/play` i följd av ett clip namn' });
  return filedArray;
};

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);
