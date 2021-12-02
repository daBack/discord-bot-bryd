import ICommandOption from './ICommandOption';

export default interface ICommandType {
  name: string;
  description: string;
  option?: ICommandOption;
}
