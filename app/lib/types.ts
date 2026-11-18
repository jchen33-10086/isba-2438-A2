export type ContactEntry = {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  content: string;
  createdAt: string;
};

export type Project = {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  overview: string;
  features: string[];
};

export type Resource = {
  id: string;
  title: string;
  url: string;
  topic: string;
  notes: string;
  createdAt: string;
};
