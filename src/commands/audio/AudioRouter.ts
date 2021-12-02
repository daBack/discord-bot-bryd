import { CommandInteraction, VoiceChannel } from 'discord.js';
import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from '@discordjs/voice';
import { join } from 'path';

const AudioRouter = async (interaction: CommandInteraction, client) => {
  const { commandName, options } = interaction;
  console.log('hej');
  if (!interaction.guild) {
    return null;
  }
  const member = interaction.guild.members.cache.get(interaction.member.user.id);
  const voiceChannel = member?.voice.channel;
  console.log(member?.user.username);
  console.log(voiceChannel?.id);

  let channelId = '';
  if (voiceChannel instanceof VoiceChannel) {
    channelId = voiceChannel.id;
  }

  switch (options.getString('search')) {
    case 'GussCarry': {
      try {
        console.log(join(__dirname + '/assets/', 'GussHeal.mp3'));

        const player = createAudioPlayer();

        const clip = createAudioResource(join(__dirname + '/assets/', 'GussHeal.mp3'));
        const connection = joinVoiceChannel({
          channelId: channelId,
          guildId: process.env.GUILD_ID_TEST || '',
          adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        player.play(clip);
        connection.subscribe(player);
        player.on(AudioPlayerStatus.Idle, () => {
          connection.disconnect();
        });
      } catch (error) {
        console.log(error);
      }
      await interaction.reply('Playin');
      break;
    }

    default:
      await interaction.reply('Just default');
      break;
  }
};
export default AudioRouter;
