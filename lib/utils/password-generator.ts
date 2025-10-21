/**
 * Generates a random password following the pattern: {username}{5 random digits}
 * Example: username "jdoe" -> "jdoe37492"
 */
export function generateRandomPassword(username: string): string {
  const digits = '0123456789';
  
  // Generate 5 random digits
  let randomDigits = '';
  for (let i = 0; i < 5; i++) {
    randomDigits += digits[Math.floor(Math.random() * digits.length)];
  }
  
  return `${username}${randomDigits}`;
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

