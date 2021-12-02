import TagEnum from './../enums/TagEnum';

export default interface IAudioClips {
  name: string;
  path: string;
  filename: string;
  tags: TagEnum[];
}
