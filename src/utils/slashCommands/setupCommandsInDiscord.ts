import dotenv from 'dotenv';
dotenv.config();
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import commands from './Commands';
import { SlashCommandBuilder } from '@discordjs/builders';
import CommandTypeEnum from './enums/CommandTypeEnum';

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN!);

/**
 * Dynamic creation of slash commands from the command file.
 */
const slashCommands: SlashCommandBuilder[] = [];
for (const command of commands) {
  const slashCommand: SlashCommandBuilder = new SlashCommandBuilder();
  slashCommand.setName(command.name);
  slashCommand.setDescription(command.description);

  if (command.option?.type === CommandTypeEnum.string) {
    slashCommand.addStringOption((option) =>
      option.setName(command.option!.name).setDescription(command.option!.description),
    );
  }
  slashCommands.push(slashCommand);
}
slashCommands.map((command) => command.toJSON());

rest
  .put(Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID_TEST!), {
    body: slashCommands,
  })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
