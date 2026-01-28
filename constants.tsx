
import { ManagerId, Manager, Language } from './types';

export const MANAGERS: Manager[] = [
  {
    id: ManagerId.MEETING_ROOM,
    name: "Management Meeting",
    role: "Board Room",
    experience: "Collective",
    expertise: ["General Management", "Cross-department Coordination"],
    avatar: "https://cdn-icons-png.flaticon.com/512/3122/3122155.png",
    color: "bg-slate-800"
  },
  {
    id: ManagerId.SENIOR_DYEING_MANAGER,
    name: "Mr. Abdur Rahman",
    role: "Senior Dyeing Manager",
    experience: "22 Years",
    expertise: ["Reactive Dyeing", "Shade Correction", "Bulk Approval"],
    avatar: "https://picsum.photos/seed/dyeing/200",
    color: "text-blue-600"
  },
  {
    id: ManagerId.SENIOR_FINISHING_MANAGER,
    name: "Mr. Kamal Uddin",
    role: "Senior Finishing Manager",
    experience: "18 Years",
    expertise: ["GSM Control", "Shrinkage", "Compactor Settings"],
    avatar: "https://picsum.photos/seed/finishing/200",
    color: "text-emerald-600"
  },
  {
    id: ManagerId.LAB_SENIOR_MANAGER,
    name: "Mr. Sharif Ahmed",
    role: "Lab Senior Manager",
    experience: "15 Years",
    expertise: ["Color Matching", "Lab Dip", "Chemical Testing"],
    avatar: "https://picsum.photos/seed/lab/200",
    color: "text-cyan-600"
  },
  {
    id: ManagerId.SENIOR_KNITTING_MANAGER,
    name: "Mr. Zakir Hossain",
    role: "Senior Knitting Manager",
    experience: "20 Years",
    expertise: ["Circular Knitting", "Yarn Quality", "Efficiency"],
    avatar: "https://picsum.photos/seed/knitting/200",
    color: "text-orange-600"
  },
  {
    id: ManagerId.QUALITY_ASSURANCE_HEAD,
    name: "Ms. Nasrin Akhter",
    role: "QA Head",
    experience: "15 Years",
    expertise: ["AQL Standards", "Buyer Compliance", "Final Audit"],
    avatar: "https://picsum.photos/seed/qa/200",
    color: "text-purple-600"
  },
  {
    id: ManagerId.PRODUCTION_PLANNING_MANAGER,
    name: "Mr. Monirul Islam",
    role: "Production Planning Manager",
    experience: "16 Years",
    expertise: ["T&A Management", "Capacity Planning", "Delivery"],
    avatar: "https://picsum.photos/seed/planning/200",
    color: "text-rose-600"
  }
];

export const TRANSLATIONS = {
  bn: {
    sidebarHeader: "ইন্ডাস্ট্রিয়াল ড্যাশবোর্ড",
    managementTeam: "সিনিয়র ম্যানেজমেন্ট টিম",
    shiftStatus: "শিফট স্ট্যাটাস",
    active: "সক্রিয়",
    target: "প্রোডাকশন টার্গেট",
    sessionActive: "ইন্ডাস্ট্রি সেশন সক্রিয়",
    placeholder: "মিটিংয়ে আপনার কথা লিখুন...",
    emptyTitle: "ম্যানেজমেন্ট মিটিং শুরু করুন",
    emptyDesc: (name: string) => name === "Management Meeting" 
      ? "ফ্যাক্টরির সকল সিনিয়র ম্যানেজার এখানে আছেন। একটি সমস্যা বা টপিক নিয়ে আলোচনা শুরু করুন।"
      : `আপনি ${name} সাহেবের রুমে আছেন। ফ্যাব্রিক রিপোর্ট বা প্রোডাকশন ডাটা নিয়ে কথা বলুন।`,
    loading: "ম্যানেজাররা আলোচনা করছেন...",
    insights: "ইন্ডাস্ট্রি ইনসাইটস সক্রিয়",
    expertMode: "এক্সপার্ট মোড সক্রিয়",
    enterToSend: "Enter চেপে পাঠান",
    meetingRoom: "বোর্ড রুম (গ্রুপ চ্যাট)",
    notesSection: "ফ্যাক্টরি নোটস",
    saveNote: "নোট হিসেবে সেভ করুন",
    noteSaved: "নোট সেভ করা হয়েছে",
    noNotes: "কোন সেভ করা নোট নেই",
    deleteNote: "নোট মুছুন"
  },
  en: {
    sidebarHeader: "Industrial Dashboard",
    managementTeam: "Senior Management Team",
    shiftStatus: "Shift Status",
    active: "ACTIVE",
    target: "Production Target",
    sessionActive: "Industry Session Active",
    placeholder: "Type a message",
    emptyTitle: "Start Management Meeting",
    emptyDesc: (name: string) => name === "Management Meeting"
      ? "All senior managers are present here. Start a discussion about a production issue or goal."
      : `You are in ${name}'s room. Discuss fabric reports or production data.`,
    loading: "Managers are discussing...",
    insights: "Industry Insights Enabled",
    expertMode: "Expert Mode Active",
    enterToSend: "Press Enter to send",
    meetingRoom: "Board Room (Group Chat)",
    notesSection: "Factory Notes",
    saveNote: "Save as Note",
    noteSaved: "Saved to Notes",
    noNotes: "No saved notes yet",
    deleteNote: "Delete Note"
  }
};

export const getSystemInstruction = (managerId: ManagerId, language: Language) => {
  const langText = language === 'bn' ? "ONLY in Bangla (professional standard)" : "ONLY in English (professional standard)";
  
  if (managerId === ManagerId.MEETING_ROOM) {
    return `
You are the Management Team of a Bangladeshi Knit Textile Organization.
When the user speaks, multiple managers should respond to simulate a meeting.

RULES:
1. Language: ${langText}.
2. Response Format: You MUST return a JSON array of responses.
   [
     {"managerId": "SENIOR_DYEING_MANAGER", "text": "..."},
     {"managerId": "LAB_SENIOR_MANAGER", "text": "..."}
   ]
3. Content: 
   - Identify which manager is the primary person to answer the user's specific query.
   - Then, 1 or 2 other managers should "share their opinion" or "ask a follow-up question" from their perspective.
4. Available Manager IDs: SENIOR_DYEING_MANAGER, SENIOR_FINISHING_MANAGER, LAB_SENIOR_MANAGER, SENIOR_KNITTING_MANAGER, QUALITY_ASSURANCE_HEAD, PRODUCTION_PLANNING_MANAGER.

Stay professional and technical.
`;
  }

  return `
You are a Virtual Knit Textile Industry Dashboard representing a real-life Bangladeshi knit textile manufacturing organization.
Your role is to act as a specific senior-level manager. You respond exactly as a highly experienced Bangladeshi professional with practical factory-floor knowledge.

GLOBAL RULES:
1. Language: Respond ${langText}. Use industry technical terms naturally.
2. Tone: Confident, practical manager. Highly technical but professional.
3. Visualization:
   - [VISUAL_DATA: {"type": "bar" | "line", "title": "Title", "labels": ["Jan", ...], "datasets": [{"label": "Name", "values": [10, ...]}] }]
   - [VISUAL_REF: {"keyword": "lab dip" | "spectrophotometer" | "dye lab" | "fabric testing"}]

MANAGER CONTEXT:
${MANAGER_SPECIFIC_INSTRUCTIONS[managerId]}
`;
};

const MANAGER_SPECIFIC_INSTRUCTIONS: Record<string, string> = {
  [ManagerId.SENIOR_DYEING_MANAGER]: `
  Manager: Senior Dyeing Manager (Mr. Abdur Rahman). Expert in shade, reactive dyeing, chemicals.
  Focus on shade matching and bulk transfer.
  `,
  [ManagerId.SENIOR_FINISHING_MANAGER]: `
  Manager: Senior Finishing Manager (Mr. Kamal Uddin). Expert in GSM, shrinkage, stenter settings.
  `,
  [ManagerId.LAB_SENIOR_MANAGER]: `
  Manager: Lab Senior Manager (Mr. Sharif Ahmed). 
  Expertise: Color Matching (Lab Dip), Spectrophotometer, Delta E, CMC settings.
  `,
  [ManagerId.SENIOR_KNITTING_MANAGER]: `
  Manager: Senior Knitting Manager (Mr. Zakir Hossain). Expert in circular knitting and yarn.
  `,
  [ManagerId.QUALITY_ASSURANCE_HEAD]: `
  Manager: QA Head (Ms. Nasrin Akhter). Expert in AQL and buyer compliance.
  `,
  [ManagerId.PRODUCTION_PLANNING_MANAGER]: `
  Manager: Production Planning Manager (Mr. Monirul Islam). Expert in T&A and efficiency.
  `
};
