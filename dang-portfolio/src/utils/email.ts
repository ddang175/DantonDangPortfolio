export const getEmailAddress = (): string => {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_CONTACT_EMAIL) {
    return process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  }

  return "contact@example.com";
};
