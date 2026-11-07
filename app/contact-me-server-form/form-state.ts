export type ContactFormState = {
  status: "idle" | "success" | "error";
  errors: string[];
};

export const initialContactFormState: ContactFormState = {
  status: "idle",
  errors: [],
};
