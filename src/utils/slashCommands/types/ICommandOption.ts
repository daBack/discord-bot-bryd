import CommandTypeEnum from './../enums/CommandTypeEnum';

export default interface ICommandType {
  type: CommandTypeEnum;
  name: string;
  description: string;
}
