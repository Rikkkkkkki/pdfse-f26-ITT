export type StackId = "web" | "bot" | "game" | "mobile";

export interface StackConfig {
  id: StackId;
  name: string;
  category: string;
  icon: string;
  tagline: string;
  coreTools: { role: string; tool: string; why: string }[];
  skipForNow: string[];
  day1Milestones: string[];
  /** What the learner should paste as proof they shipped something. */
  proofHint: string;
  command: string;
  /** "link" stacks copy a URL instead of a shell command. */
  commandKind: "command" | "link";
}

export const STACK_ORDER: StackId[] = ["web", "bot", "game", "mobile"];

// Claims were checked against official docs on 2026-11-09 where noted.
// Re-verify before each test round: these tools change fast.
export const STACKS: Record<StackId, StackConfig> = {
  web: {
    id: "web",
    name: "Next.js + Tailwind CSS + Vercel",
    category: "Web App",
    icon: "🌐",
    tagline: "One framework from your first page to a public URL.",
    coreTools: [
      {
        role: "Framework",
        tool: "Next.js (React + TypeScript)",
        why: "Pages and server code live in one project.",
      },
      {
        role: "Styling",
        tool: "Tailwind CSS",
        why: "Style in the same file you are editing.",
      },
      {
        role: "Hosting",
        tool: "Vercel",
        why: "Connect a GitHub repo and get a public URL.",
      },
      {
        role: "Database",
        tool: "None on Day 1",
        why: "Add one when a feature needs to save data, not before.",
      },
    ],
    skipForNow: [
      "Docker or Kubernetes",
      "Global state libraries",
      "Building your own login system",
      "Switching frameworks mid-project",
    ],
    day1Milestones: [
      "Run the starter command, then npm run dev and open localhost:3000",
      "Replace the hero heading with your real project idea",
      "Push to GitHub and import the repo in Vercel to get a public URL",
    ],
    proofHint: "Your live Vercel URL",
    // --no-src-dir is the documented negation form (nextjs.org create-next-app reference).
    command:
      "npx create-next-app@latest my-app --ts --tailwind --eslint --app --no-src-dir --use-npm",
    commandKind: "command",
  },
  bot: {
    id: "bot",
    name: "Python + python-telegram-bot",
    category: "Telegram Bot",
    icon: "🤖",
    tagline: "A bot that answers a message, running on your own laptop.",
    coreTools: [
      {
        role: "Language",
        tool: "Python 3",
        why: "Readable syntax and a large library ecosystem.",
      },
      {
        role: "Bot library",
        tool: "python-telegram-bot",
        why: "Async handlers for commands and messages.",
      },
      {
        role: "Storage",
        tool: "SQLite file",
        why: "Built into Python. No account or server.",
      },
      {
        role: "Where it runs",
        tool: "Your laptop (long-polling)",
        why: "No hosting or certificates needed to get a first reply.",
      },
    ],
    skipForNow: [
      "Cloud hosting (Render workers have no free tier)",
      "Message queues",
      "Webhooks and SSL certificates",
      "Database migrations",
    ],
    day1Milestones: [
      "Create a bot with @BotFather and save the token in a .env file",
      "Run the ping-pong example and get a reply in Telegram",
      "Add .env to .gitignore, then push the project to GitHub",
    ],
    proofHint: "Your GitHub repo URL (never commit your token)",
    command: "python -m pip install python-telegram-bot python-dotenv",
    commandKind: "command",
  },
  game: {
    id: "game",
    name: "Godot 4 + GDScript",
    category: "2D Game",
    icon: "🎮",
    tagline: "A character you can move, in one editor.",
    coreTools: [
      {
        role: "Engine",
        tool: "Godot 4",
        why: "Free, open-source editor in a single download.",
      },
      {
        role: "Language",
        tool: "GDScript",
        why: "Python-like syntax built for Godot's node system.",
      },
      {
        role: "Movement",
        tool: "CharacterBody2D",
        why: "Built-in node for moving a character and colliding.",
      },
      {
        role: "Version control",
        tool: "Git + GitHub",
        why: "Your project is safe and shareable from Day 1.",
      },
    ],
    skipForNow: [
      "Engine comparisons",
      "Writing your own engine code",
      "3D and shaders",
      "Web export and publishing",
    ],
    day1Milestones: [
      "Install Godot 4 and create a new 2D scene",
      "Add a CharacterBody2D with a sprite that moves with the arrow keys",
      "Press F5 to run it, then push the project to GitHub",
    ],
    proofHint: "Your GitHub repo URL",
    command: "https://godotengine.org/download",
    commandKind: "link",
  },
  mobile: {
    id: "mobile",
    name: "React Native + Expo",
    category: "Mobile App",
    icon: "📱",
    tagline: "See your app on your own phone in minutes.",
    coreTools: [
      {
        role: "Framework",
        tool: "Expo (React Native)",
        why: "Run on a phone without installing Xcode or Android Studio.",
      },
      {
        role: "Testing",
        tool: "Expo Go app",
        why: "Scan a QR code to load your app on your phone.",
      },
      {
        role: "Version control",
        tool: "Git + GitHub",
        why: "Your project is safe and shareable from Day 1.",
      },
    ],
    skipForNow: [
      "Swift or Kotlin code",
      "Debugging CocoaPods or Gradle",
      "Styling libraries",
      "App Store accounts and publishing",
    ],
    day1Milestones: [
      "Run the starter command, then npx expo start in the new folder",
      "Open the app in Expo Go (if asked, pick the SDK your Expo Go supports)",
      "Change a Text label, watch it reload, then push to GitHub",
    ],
    proofHint: "Your GitHub repo URL",
    command: "npx create-expo-app@latest my-mobile-app",
    commandKind: "command",
  },
};
