// Тип для вложения (attachment)
export interface IAttachment {
  ObjectID: string;
  ObjectName: string;
  PrintAvailable: boolean;
  IsFile: boolean;
  Type?: string;
  [key: string]: any;
}

// Тип для тега
export interface ITag {
  TagName: string;
  imgAddress: string;
  ImageID?: string;
  [key: string]: any;
}

// Тип для изображения
export interface IImage {
  ImageID: string;
  Адрес: string;
  Порядок?: number;
  [key: string]: any;
}

// Тип для новости
export interface INews {
  ObjectID: string;
  Title: string;
  Content: string;
  Author?: string;
  Date: string;
  New?: boolean;
  ObjectType: string;
  Images?: IImage[];
  Attachments?: IAttachment[];
  Tags?: ITag[];
  [key: string]: any;
}
