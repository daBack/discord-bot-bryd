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
import { IAudioClips, Sounds } from '../../utils/sounds';
import { initializeFirebase } from '../../utils/firebase';
import { FirebaseApp } from 'firebase/app';
import { getDownloadURL, getStorage, listAll, ref } from 'firebase/storage';

interface IAudioRouterUrlType {
  downloadUrl: string;
  name: string;
}

const AudioRouter = async (interaction: CommandInteraction, client) => {
  const { options } = interaction;
  const commandQuery = options.getString('clip');

  /**
   * Creating firebase storage app.
   */

  let firebaseApp: FirebaseApp;
  try {
    firebaseApp = initializeFirebase();
  } catch (error) {
    throw new Error(`Could not initialize firebase storage. Error: ${error}`);
  }

  let clip: IAudioRouterUrlType | null;
  switch (commandQuery) {
    // case 'random':
    //   clip = await getRandomClip(interaction);
    //   break;
    default:
      clip = await getClip({ commandQuery: commandQuery!, firebaseApp });
      break;
  }

  if (!clip) {
    await interaction.reply('Nu sökte du på något dumt.. detta clippet finns inte :man_shrugging:');
    return;
  }
  playSound({ clip: clip!, interaction: interaction });
};

/**
 * Get clip from firebase.
 * @param options Options.
 * @returns Nothing
 */
const getClip = async (options: {
  commandQuery: string;
  firebaseApp: FirebaseApp;
}): Promise<IAudioRouterUrlType | null> => {
  const { commandQuery, firebaseApp } = options;

  const storage = getStorage(firebaseApp);
  const clip = Sounds.find((clip) => commandQuery === clip.name);
  const pathRef = ref(storage, `clips/${clip?.filename}`);
  let downloadUrl: string;
  try {
    downloadUrl = await getDownloadURL(pathRef);
    if (!downloadUrl || !clip) {
      return null;
    }
    return {
      downloadUrl: downloadUrl,
      name: clip.name,
    };
  } catch (error) {
    return null;
  }
};
/**
 * Get random sound
 * @param options Options.
 * @returns Nothing
 */
const getRandomClip = async (interaction): Promise<object | null> => {
  await interaction.reply(`Urgh... ska ja implementera detta också....`);
  return null;
  // const storage = getStorage(firebaseApp);
  // const listRef = ref(storage, 'clips');
  // interaction.deferReply();

  // const res = await listAll(listRef);

  // const clipFilename = Sounds.find((clip) => {
  //   console.log(commandQuery, clip.filename);
  //   return commandQuery === clip.name;
  // });
  // console.log(clipFilename);

  // if (!clipFilename) {
  //   return null;
  // }
  // const clipRef = res.items.find((itemRef) => itemRef.name === clipFilename.filename);
};

/**
 * Plays the clip in the discord channel.
 *
 * @param options
 * @returns Void.
 */
const playSound = async (options: { clip: IAudioRouterUrlType; interaction: CommandInteraction }): Promise<void> => {
  const { clip, interaction } = options;

  const voiceConnection = await setupVoiceConnection(interaction);
  if (!voiceConnection) {
    return;
  }
  const { connection, player } = voiceConnection || null;
  const audioResource = createAudioResource(clip.downloadUrl);
  player.play(audioResource);
  connection.subscribe(player);
  await interaction.reply({
    content: `Here you go ${interaction.member.user.username}, your favorite ${clip.name} clip`,
    ephemeral: true,
  });

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
): Promise<{ connection: VoiceConnection; player: AudioPlayer } | null> => {
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
    return null;
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
