/**
 * Generates a random password following the pattern: {username}{1 digit}{4 alphanumeric}
 * Example: username "jdoe" -> "jdoe3a7k2"
 */
export function generateRandomPassword(username: string): string {
  const digits = '0123456789';
  const alphanumeric = '0123456789abcdefghijklmnopqrstuvwxyz';
  
  // First character: random digit (0-9)
  const firstChar = digits[Math.floor(Math.random() * digits.length)];
  
  // Next 4 characters: random alphanumeric
  let randomChars = '';
  for (let i = 0; i < 4; i++) {
    randomChars += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
  }
  
  return `${username}${firstChar}${randomChars}`;
}

/**
 * Generates username from first and last name: {first_letter_of_firstname}{lastname}
 * Example: "John" + "Doe" -> "jdoe"
 */
export function generateUsername(firstName: string, lastName: string): string {
  const firstLetter = firstName.charAt(0).toLowerCase();
  const lastNameLower = lastName.toLowerCase().replace(/\s+/g, '');
  return `${firstLetter}${lastNameLower}`;
}

