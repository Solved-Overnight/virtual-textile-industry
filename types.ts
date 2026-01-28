
export enum ManagerId {
  MEETING_ROOM = 'MEETING_ROOM',
  SENIOR_DYEING_MANAGER = 'SENIOR_DYEING_MANAGER',
  SENIOR_FINISHING_MANAGER = 'SENIOR_FINISHING_MANAGER',
  SENIOR_KNITTING_MANAGER = 'SENIOR_KNITTING_MANAGER',
  QUALITY_ASSURANCE_HEAD = 'QUALITY_ASSURANCE_HEAD',
  PRODUCTION_PLANNING_MANAGER = 'PRODUCTION_PLANNING_MANAGER',
  LAB_SENIOR_MANAGER = 'LAB_SENIOR_MANAGER'
}

export type Language = 'bn' | 'en';
export type ActiveView = 'chat' | 'notes';

export interface Manager {
  id: ManagerId;
  name: string;
  role: string;
  experience: string;
  expertise: string[];
  avatar: string;
  color: string;
}

export interface Attachment {
  type: 'image' | 'chart';
  url?: string; // For images
  data?: any;   // For chart configuration/data
  mimeType?: string;
}

export interface Message {
  role: 'user' | 'model';
  managerId?: ManagerId; // To identify who is speaking in a group
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
}

export interface Note {
  id: string;
  question: string;
  answer: string;
  managerName: string;
  timestamp: string;
}

export interface ChatSession {
  managerId: ManagerId;
  messages: Message[];
}
