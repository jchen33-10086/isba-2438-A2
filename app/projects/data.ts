export type Project = {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  overview: string;
  features: string[];
};

export const projects: Project[] = [
  {
    slug: "project-one",
    title: "Agentic AI Solution for Cisco's RMA System",
    description:
      "An agentic AI solution for Cisco's RMA system with automatic translation, customer experience improvements, and fraud detection.",
    tech: ["Python", "SQL", "Agentic AI"],
    overview:
      "As a team member, I helped develop an agentic AI solution for Cisco's RMA (Return Merchandise Authorization) system. The solution combines automatic translation, customer experience improvements, and fraud detection to streamline the RMA process.",
    features: [
      "Automatic translation for customers and support teams.",
      "Customer experience improvements across the RMA workflow.",
      "Fraud detection to flag suspicious return requests.",
    ],
  },
  {
    slug: "project-two",
    title: "Project Two",
    description:
      "A short placeholder description of your second project and what it does.",
    tech: ["Python", "SQL"],
    overview:
      "This is a placeholder overview for Project Two. Replace it with details about what the project does, why you built it, and what you learned while building it.",
    features: [
      "Placeholder feature one goes here.",
      "Placeholder feature two goes here.",
      "Placeholder feature three goes here.",
    ],
  },
];
