export type RegistrationRole = "" | "contributor" | "enterprise" | "reviewer";
export type ContributorType  = "" | "student" | "women_workforce" | "general_workforce";

export interface PasswordStrength {
  score: number;
  label: "Weak" | "Fair" | "Strong";
  color: string;
}
