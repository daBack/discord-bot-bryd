import TagEnum from './../enums/TagEnum';

export default interface IAudioClips {
  name: string;
  filename: string;
  tags: TagEnum[];
}
