export interface ToolCategory {
  id: string;
  title: string;
  color: string;
  hex: string;
  iconName: string;
  tools: string[];
}

export const toolCategories: ToolCategory[] = [
  {
    id: "video",
    title: "AI Video & Explainer Tools",
    color: "accentTeal",
    hex: "#0FA884",
    iconName: "Video",
    tools: [
      "HeyGen", "Synthesia", "InVideo AI", "Fliki", "Runway Gen-2", "Pika Labs", "Sora",
      "Colossyan", "DeepBrain AI", "Elai.io", "Hour One", "Lumen5", "Pictory", "Kaiber", "Steve AI"
    ]
  },
  {
    id: "image",
    title: "AI Image & Stock Generators",
    color: "accentAmber",
    hex: "#F59E0B",
    iconName: "Image",
    tools: [
      "Midjourney", "DALL-E 3", "Adobe Firefly", "Stable Diffusion", "Canva Magic Media",
      "Leonardo.ai", "Clipdrop", "Craiyon", "Bing Image Creator", "NightCafe", "Photoleap AI",
      "Runway AI", "Picsart AI", "DeepAI", "Playground AI"
    ]
  },
  {
    id: "flowchart",
    title: "AI Flowchart & Mind Map Tools",
    color: "accentCoral",
    hex: "#E85D40",
    iconName: "Network",
    tools: [
      "Whimsical AI", "Miro Assist", "EdrawMind AI", "GitMind AI", "Taskade AI", "Mapdeduce",
      "Lucidchart AI", "Xmind Copilot", "Algor Education", "Aynil", "MyMap.ai", "Boardmix AI",
      "Creately AI", "Chatmind", "Eraser.io DiagramGPT"
    ]
  },
  {
    id: "quiz",
    title: "AI Quiz & Question Generators",
    color: "accentPurple",
    hex: "#6B5CF6",
    iconName: "HelpCircle",
    tools: [
      "Diffit", "Quizizz AI", "Conker AI", "Questgen.ai", "Formative AI", "Yippity", "PrepAI",
      "Monic.ai", "Kahoot! AI", "Quizgecko", "Eduaide.Ai", "Nolej AI", "Mindsmith",
      "QuestionWell", "ClassMarker"
    ]
  },
  {
    id: "simulation",
    title: "AI Simulation & Virtual Labs",
    color: "accentBlue",
    hex: "#2563EB",
    iconName: "Layers",
    tools: [
      "Labster", "PraxiLabs", "SimInsights HyperSkill", "VRLab Academy", "SimBio AI",
      "Inspirit VR", "ScienceVR", "Macmillan Learning Simulations", "Interplay Learning",
      "MEL Science VR", "Simulations Plus", "Ansys Innovation Courses", "BioDigital Human",
      "CloudLabs", "PhET Interactive AI Integrations"
    ]
  }
];

// 5 categories with 4-5 floating tool names each for the Ecosystem Orbiting Rings
export const orbitCategoryData = [
  {
    category: "video",
    icon: "Video",
    color: "#0FA884",
    tools: ["HeyGen", "Synthesia", "InVideo AI", "Lumen5", "Sora"]
  },
  {
    category: "image",
    icon: "Image",
    color: "#F59E0B",
    tools: ["Midjourney", "DALL-E 3", "Adobe Firefly", "Leonardo.ai"]
  },
  {
    category: "flowchart",
    icon: "Network",
    color: "#E85D40",
    tools: ["Whimsical AI", "Miro Assist", "Lucidchart", "Eraser.io"]
  },
  {
    category: "quiz",
    icon: "HelpCircle",
    color: "#6B5CF6",
    tools: ["Diffit", "Quizizz AI", "Kahoot! AI", "Quizgecko"]
  },
  {
    category: "simulation",
    icon: "Layers",
    color: "#2563EB",
    tools: ["Labster", "PraxiLabs", "PhET", "Inspirit VR"]
  }
];
