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

  //const subscription = connection.subscribe(player);
  //if (subscription) {
  // Unsubscribe after 5 seconds (stop playing audio on the voice connection)
  //  setTimeout(() => subscription.unsubscribe(), 5_000);
  // }

  switch (options.getString('search')) {
    case 'GussCarry': {
      try {
        console.log(join(__dirname + '/assets/', 'GussHeal.mp3'));

        const player = createAudioPlayer();

        const clip = createAudioResource(join(__dirname + '/assets/', 'GussHeal.mp3'));
        //const clip = createAudioResource(
        //  'https://cdn.discordapp.com/attachments/456207515676573716/915730447697338368/Sov_Sov_Coffe_mp3cut.net.mp3',
        //);

        const connection = joinVoiceChannel({
          channelId: channelId,
          guildId: process.env.GUILD_ID || '',
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
