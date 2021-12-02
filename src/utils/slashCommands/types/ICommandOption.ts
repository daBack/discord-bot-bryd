import CommandTypeEnum from './CommandTypeEnum';

export default interface ICommandType {
  type: CommandTypeEnum;
  name: string;
  description: string;
}
