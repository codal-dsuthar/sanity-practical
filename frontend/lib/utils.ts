export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const WHITE_SPACE_REGEX = /\s+/;

/**
 * Splits a full name into first and last name
 * @param fullName - The full name to split
 * @returns An object with firstName and lastName
 */
export function splitName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  if (!fullName) {
    return { firstName: "", lastName: "" };
  }

  const parts = fullName.trim().split(WHITE_SPACE_REGEX);

  if (parts.length === 0) {
    return { firstName: "", lastName: "" };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }

  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ");

  return { firstName, lastName };
}

/**
 * Gets the author's name parts, using provided firstName/lastName if available,
 * otherwise falls back to splitting the full name
 * @param author - The author object
 * @returns An object with firstName and lastName
 */
export function getAuthorNames(author: {
  firstName?: string | null;
  lastName?: string | null;
}): {
  firstName: string;
  lastName: string;
} {
  if (author.firstName && author.lastName) {
    return {
      firstName: author.firstName,
      lastName: author.lastName,
    };
  }

  if (author.firstName) {
    return {
      firstName: author.firstName,
      lastName: author.lastName || "",
    };
  }

  return splitName("");
}
