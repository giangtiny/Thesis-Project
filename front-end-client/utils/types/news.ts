export interface NewsDetailDto {
  id: string;
  title: string;
  thumbnail: string;
  time: string;
  tag: string;
  content?: NewContent[];
}

export interface NewContent {
  header: string;
  image: string;
  highLight?: string;
  text: string;
}
