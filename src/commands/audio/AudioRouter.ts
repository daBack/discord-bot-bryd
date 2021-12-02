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
import audioClips from '../../utils/sounds/sounds';

const AudioRouter = async (interaction: CommandInteraction, client) => {
  const { commandName, options } = interaction;
  const { connection, player } = await setupVoiceConnection(interaction);

  /* TODO: Make this dynamic from search input */
  const commandQuery = options.getString('clip');
  const file = audioClips.find((clip) => clip.name === commandQuery);

  if (!file) {
    await interaction.reply(`I am sorry, but that clip doesn't exist, try with /random`);
    return;
  }
  const clip = createAudioResource(join(require.main?.path + '/assets/', file.filename));
  player.play(clip);
  connection.subscribe(player);
  await interaction.reply(`Here you go mongo, your favorite ${file.name} clip`);

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
