import { CommandInteraction, VoiceChannel } from 'discord.js';
import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
  VoiceConnection,
} from '@discordjs/voice';
import { join } from 'path';

const AudioRouter = async (interaction: CommandInteraction, client) => {
  const { commandName, options } = interaction;
  const { connection, player } = await setupVoiceConnection(interaction);

  /* TODO: Make this dynamic from search input */
  const clip = createAudioResource(join(__dirname + '/assets/', 'GussHeal.mp3'));

  switch (options.getString('search')) {
    case 'GussCarry': {
      player.play(clip);
      connection.subscribe(player);

      await interaction.reply('Playin');
      break;
    }

    default:
      await interaction.reply('Just default');
      break;
  }
  player.on(AudioPlayerStatus.Idle, () => {
    connection.disconnect();
  });
};

/**
 * Returns the Audio player and the connection to the channel.
 * @param interaction CommandInteraction.
 * @returns Audio player and Channel connection.
 */
const setupVoiceConnection = async (
  interaction: CommandInteraction,
): Promise<{ connection: VoiceConnection; player: AudioPlayer }> => {
  if (!interaction.guild) {
    throw new Error('Guild is missing, Fuck!');
  }

  /**
   * Retrieve which channel the user is in.
   */
  const member = interaction.guild.members.cache.get(interaction.member.user.id);
  const voiceChannel = member?.voice.channel;

  /**
   * Checks if the user is in a voice channel when writing the command.
   */
  let channelId = '';
  if (voiceChannel instanceof VoiceChannel) {
    channelId = voiceChannel.id;
  } else {
    await interaction.reply('You are not in a voice channel dumbo...');
  }

  /**
   * Creates the audio player and connection
   */
  const player = createAudioPlayer();
  const connection = joinVoiceChannel({
    channelId: channelId,
    guildId: process.env.GUILD_ID_TEST || '',
    adapterCreator: interaction.guild.voiceAdapterCreator,
  });

  return { connection, player };
};
export default AudioRouter;
