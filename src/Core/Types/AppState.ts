export interface AppState {
  menuItems: ITab[];
  forState: ISection[];
  instructions: IInstructions[];
  additionalInfo: IAdditionalInfo | object;
  openSwiper: boolean;
  developer: boolean;
  page: string;
  countActualTasks: number;
  countUnreadNews: number;
}

export interface User {
  Name: string;
  Id: string;
  Role?: string;
}

export interface IAppData {
  Sections: ISection[];
  Tabs: ITab[];
}

export interface ISection {
  SectionName: string;
  SectionCode?: string;
  sectionData?: {
    list?: Array<{
      Id: string | number;
      Title: string;
      Done?: boolean;
      New?: boolean;
      [key: string]: any;
    }>;
    [key: string]: any;
  };
}

export interface ITab {
  path: string;
  label: string;
  icon: string;
  objectId: number;
  item: string;
}

export interface IAttachment {
  OwnerID: string;
  ObjectName: string;
  ObjectID: number;
  PrintAvailable: boolean;
  IsFile: boolean;
  Type: string;
}

export interface IImage {
  address: string;
  ImageID: string;
}

export interface ITag {
  TagName: string;
  imgAddress: string;
}

export interface IAdditionalInfo {
  // Основные поля
  Done: boolean;
  DoneDate: string; // или Date если будет преобразование
  Date: string;
  Title: string;
  Deadline: string;
  Header: string;
  TaskID: string;
  TaskClass: string;
  ClientID: string;

  // Счётчики
  DoneCount: number;
  QuestionCount: number;

  // Типы и классификаторы
  ResultType: string; // или number если всегда числовой
  ObjectType: string;
  LongHeader: boolean;

  // Изображения и медиа
  ListImage: string;
  ListImageID: string;
  ListProductID: string;

  // Списки
  SelectionList: string;

  // Контент
  Content: string; // HTML content

  // Ответственность
  Responsible: string;

  // Флаги
  ReadOnly: boolean;
  HighPriority: boolean;

  // Коллекции
  attachments: IAttachment[];
  images: IImage[];

  // Идентификаторы
  ObjectID: string;

  // Сортировка
  DateSort: string;

  // Теги
  tags: ITag[];
}

export interface IInstructions {
  Наименование: string;
  id: number;
  PrintFiles: number;
  TotalFiles: number;
  AttachedFilesStatus: number;
  Строки: IInstructions[];
}
