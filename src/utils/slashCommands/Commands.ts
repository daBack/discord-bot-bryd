import CommandTypeEnum from './enums/CommandTypeEnum';
import ICommand from './types/ICommand';

const commands: ICommand[] = [
  {
    name: 'tekarn',
    description: 'Says something interesting about Tekarn',
  },
  {
    name: 'coffe',
    description: 'Says something interesting about Coffe',
  },
  {
    name: 'guss',
    description: 'Says something interesting about Guss',
  },
  {
    name: 'jonte',
    description: 'Says something interesting about Jonte',
  },
  {
    name: 'bäck',
    description: 'Says something interesting about Bäck',
  },
  {
    name: 'jocke',
    description: 'Says something interesting about Jocke',
  },
  {
    name: 'play',
    description: 'Play a known sound (eg. gussCarry)',
    option: {
      type: CommandTypeEnum.string,
      name: 'clip',
      description: 'Which clip shall bring you joy?',
    },
  },
  {
    name: 'listclips',
    description: 'A list of all clips this Awesome bot can play.. for now',
  },
];

export default commands;
