// Helper function to remove Vietnamese accents and convert to Latin characters
export const removeVietnameseAccents = (str: string): string => {
  // Map of Vietnamese characters with accents to their Latin equivalents
  const vietnameseMap: Record<string, string> = {
    // A variants - Vietnamese specific
    'Ă': 'A', 'ă': 'A', 'Ằ': 'A', 'ằ': 'A', 'Ẳ': 'A', 'ẳ': 'A', 
    'Ẵ': 'A', 'ẵ': 'A', 'Ắ': 'A', 'ắ': 'A', 'Ặ': 'A', 'ặ': 'A',
    'Â': 'A', 'â': 'A', 'Ầ': 'A', 'ầ': 'A', 'Ẩ': 'A', 'ẩ': 'A',
    'Ẫ': 'A', 'ẫ': 'A', 'Ấ': 'A', 'ấ': 'A', 'Ậ': 'A', 'ậ': 'A',
    // A variants - Standard Latin accents
    'Á': 'A', 'á': 'A', 'À': 'A', 'à': 'A', 'Ả': 'A', 'ả': 'A',
    'Ã': 'A', 'ã': 'A', 'Ạ': 'A', 'ạ': 'A',
    // E variants - Vietnamese specific
    'Ê': 'E', 'ê': 'E', 'Ề': 'E', 'ề': 'E', 'Ể': 'E', 'ể': 'E',
    'Ễ': 'E', 'ễ': 'E', 'Ế': 'E', 'ế': 'E', 'Ệ': 'E', 'ệ': 'E',
    // E variants - Standard Latin accents
    'É': 'E', 'é': 'E', 'È': 'E', 'è': 'E', 'Ẻ': 'E', 'ẻ': 'E',
    'Ẽ': 'E', 'ẽ': 'E', 'Ẹ': 'E', 'ẹ': 'E',
    // I variants - Vietnamese specific
    'Í': 'I', 'í': 'I', 'Ì': 'I', 'ì': 'I', 'Ỉ': 'I', 'ỉ': 'I',
    'Ĩ': 'I', 'ĩ': 'I', 'Ị': 'I', 'ị': 'I',
    // O variants - Vietnamese specific
    'Ô': 'O', 'ô': 'O', 'Ồ': 'O', 'ồ': 'O', 'Ổ': 'O', 'ổ': 'O',
    'Ỗ': 'O', 'ỗ': 'O', 'Ố': 'O', 'ố': 'O', 'Ộ': 'O', 'ộ': 'O',
    'Ơ': 'O', 'ơ': 'O', 'Ờ': 'O', 'ờ': 'O', 'Ở': 'O', 'ở': 'O',
    'Ỡ': 'O', 'ỡ': 'O', 'Ớ': 'O', 'ớ': 'O', 'Ợ': 'O', 'ợ': 'O',
    // O variants - Standard Latin accents (including Õ which was missing!)
    'Ó': 'O', 'ó': 'O', 'Ò': 'O', 'ò': 'O', 'Ỏ': 'O', 'ỏ': 'O',
    'Õ': 'O', 'õ': 'O', 'Ọ': 'O', 'ọ': 'O',
    // U variants - Vietnamese specific
    'Ư': 'U', 'ư': 'U', 'Ừ': 'U', 'ừ': 'U', 'Ử': 'U', 'ử': 'U',
    'Ữ': 'U', 'ữ': 'U', 'Ứ': 'U', 'ứ': 'U', 'Ự': 'U', 'ự': 'U',
    // U variants - Standard Latin accents
    'Ú': 'U', 'ú': 'U', 'Ù': 'U', 'ù': 'U', 'Ủ': 'U', 'ủ': 'U',
    'Ũ': 'U', 'ũ': 'U', 'Ụ': 'U', 'ụ': 'U',
    // Y variants - Vietnamese specific
    'Ý': 'Y', 'ý': 'Y', 'Ỳ': 'Y', 'ỳ': 'Y', 'Ỷ': 'Y', 'ỷ': 'Y',
    'Ỹ': 'Y', 'ỹ': 'Y', 'Ỵ': 'Y', 'ỵ': 'Y',
    // D variant - Vietnamese specific
    'Đ': 'D', 'đ': 'D'
  };

  // Convert each character using the map
  const result = str.split('').map(char => {
    const mapped = vietnameseMap[char];
    if (mapped) {
      return mapped;
    }
    // If not in map, return original character (for regular letters, numbers, etc.)
    return char;
  }).join('');

  return result;
};

// Core calculation functions
export const calculateNameNumber = (name: string): { steps: string; totalBeforeReduction: number; total: number; finalNumber: number } => {
  // Remove Vietnamese accents first, then remove spaces and convert to uppercase
  const normalizedName = removeVietnameseAccents(name);
  const cleanName = normalizedName.replace(/\s+/g, '').toUpperCase();
  
  // Debug logging
  console.log('Original name:', name);
  console.log('Normalized name (after accent removal):', normalizedName);
  console.log('Clean name (after removing spaces and uppercase):', cleanName);
  
  // Mapping letters to numbers according to Pythagorean numerology
  const letterMap: Record<string, number> = {
    'A': 1, 'I': 1, 'J': 1, 'Q': 1, 'Y': 1,
    'B': 2, 'K': 2, 'R': 2,
    'C': 3, 'G': 3, 'L': 3, 'S': 3,
    'D': 4, 'M': 4, 'T': 4,
    'E': 5, 'H': 5, 'N': 5, 'X': 5,
    'U': 6, 'V': 6, 'W': 6,
    'O': 7, 'Z': 7,
    'F': 8, 'P': 8
  };
  
  // Calculate the total value of the name and track steps
  let total = 0;
  let letterValues: string[] = [];
  const skippedChars: string[] = [];
  
  for (const char of cleanName) {
    if (letterMap[char]) {
      total += letterMap[char];
      letterValues.push(`${char}=${letterMap[char]}`);
    } else {
      // Track characters that are skipped (not in letterMap)
      skippedChars.push(char);
    }
  }
  
  // Debug logging
  if (skippedChars.length > 0) {
    console.log('Characters skipped (not in letterMap):', skippedChars);
  }
  console.log('Letter values:', letterValues);
  console.log('Total before reduction:', total);
  
  // Join the steps
  const steps = letterValues.join(' + ');
  
  // Reduce to a single digit according to Vedic numerology
  const result = reduceToPythagoras(total);
  
  return {
    steps,
    totalBeforeReduction: total,
    total: result.totalBeforeReduction || total,
    finalNumber: result.finalNumber
  };
};

// Function to calculate birth number from a date
export const calculateBirthNumber = (day: number, month: number, year: number): { steps: string; totalBeforeReduction: number; total: number; finalNumber: number } => {
  // For birth number, we simply add all digits of the day
  const dayStr = day.toString();
  
  let dayDigits = dayStr.split('').map(d => parseInt(d, 10));
  let daySum = dayDigits.reduce((sum, digit) => sum + digit, 0);
  
  // Create steps explanation
  const steps = `${dayDigits.join(' + ')} = ${daySum}`;
  
  // Reduce to a single digit if needed
  const result = reduceToPythagoras(daySum);
  
  return {
    steps,
    totalBeforeReduction: daySum,
    total: result.totalBeforeReduction || daySum,
    finalNumber: result.finalNumber
  };
};

// Function to calculate life number using the full birth date
export const calculateLifeNumber = (day: number, month: number, year: number): { steps: string; totalBeforeReduction: number; total: number; finalNumber: number } => {
  // Convert all parts to strings
  const dayStr = day.toString();
  const monthStr = month.toString();
  const yearStr = year.toString();
  
  // Split each part into digits and add them up
  const dayDigits = dayStr.split('').map(d => parseInt(d, 10));
  const monthDigits = monthStr.split('').map(d => parseInt(d, 10));
  const yearDigits = yearStr.split('').map(d => parseInt(d, 10));
  
  // Sum each part separately
  const daySum = dayDigits.reduce((sum, digit) => sum + digit, 0);
  const monthSum = monthDigits.reduce((sum, digit) => sum + digit, 0);
  const yearSum = yearDigits.reduce((sum, digit) => sum + digit, 0);
  
  // Total sum
  const totalSum = daySum + monthSum + yearSum;
  
  // Create readable steps
  const steps = `(${dayStr}=${daySum}) + (${monthStr}=${monthSum}) + (${yearStr}=${yearSum}) = ${totalSum}`;
  
  // Reduce to a single digit if needed
  const result = reduceToPythagoras(totalSum);
  
  return {
    steps,
    totalBeforeReduction: totalSum,
    total: result.totalBeforeReduction || totalSum,
    finalNumber: result.finalNumber
  };
};

// Helper function to reduce a number to a single digit
export const reduceToPythagoras = (num: number): { steps: string; totalBeforeReduction?: number; finalNumber: number } => {
  let steps: string[] = [];
  let current = num;
  let totalBeforeReduction: number | undefined;
  
  // Keep reducing until we get a single digit
  while (current > 9) {
    const digits = current.toString().split('');
    const newSum = digits.reduce((sum, digit) => sum + parseInt(digit, 10), 0);
    
    // Save the first reduction for display purposes
    if (totalBeforeReduction === undefined) {
      totalBeforeReduction = newSum;
    }
    
    steps.push(`${digits.join(' + ')} = ${newSum}`);
    current = newSum;
  }
  
  return {
    steps: steps.join(' → '),
    totalBeforeReduction,
    finalNumber: current
  };
};

// For backward compatibility - mapping numbers to planets
export const getPlanetFromNumber = (number: number): string => {
  switch (number % 9) {
    case 1: return 'Sun';
    case 2: return 'Moon';
    case 3: return 'Jupiter';
    case 4: return 'Rahu';
    case 5: return 'Mercury';
    case 6: return 'Venus';
    case 7: return 'Ketu';
    case 8: return 'Saturn';
    case 0: return 'Mars'; // When number is divisible by 9
    default: return 'Unknown';
  }
};

// Life aspects enumeration
export enum LifeAspect {
  Finance = 'Finance',
  Romance = 'Romance',
  Education = 'Education',
  Health = 'Health',
  Family = 'Family',
  Growth = 'Growth',
  Career = 'Career',
  Reputation = 'Reputation',
  Spirituality = 'Spirituality',
  Luck = 'Luck'
}

// Function to get aspect scores for a specific number
export const getAspectScores = (finalNumber: number, totalBeforeReduction: number): Record<LifeAspect, number> => {
  // Get the planet name based on the single-digit final number
  const planetName = getPlanetFromNumber(finalNumber);
  
  // Define default scores
  const defaultScores: Record<LifeAspect, number> = {
    [LifeAspect.Finance]: 60,
    [LifeAspect.Romance]: 60,
    [LifeAspect.Education]: 60,
    [LifeAspect.Health]: 60,
    [LifeAspect.Family]: 60,
    [LifeAspect.Growth]: 60,
    [LifeAspect.Career]: 60,
    [LifeAspect.Reputation]: 60,
    [LifeAspect.Spirituality]: 60,
    [LifeAspect.Luck]: 60
  };

  // Planet-specific scores
  if (planetName === 'Sun') {
    return {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 70, 
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 65,
      [LifeAspect.Growth]: 75,
      [LifeAspect.Career]: 85,
      [LifeAspect.Reputation]: 90,
      [LifeAspect.Spirituality]: 55,
      [LifeAspect.Luck]: 65
    };
  } else if (planetName === 'Moon') {
    return {
      [LifeAspect.Finance]: 70,
      [LifeAspect.Romance]: 85,
      [LifeAspect.Education]: 65,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 90,
      [LifeAspect.Growth]: 70,
      [LifeAspect.Career]: 65,
      [LifeAspect.Reputation]: 75,
      [LifeAspect.Spirituality]: 80,
      [LifeAspect.Luck]: 60
    };
  } else if (planetName === 'Jupiter') {
    return {
      [LifeAspect.Finance]: 85,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 90,
      [LifeAspect.Health]: 65,
      [LifeAspect.Family]: 75,
      [LifeAspect.Growth]: 80,
      [LifeAspect.Career]: 85,
      [LifeAspect.Reputation]: 80,
      [LifeAspect.Spirituality]: 75,
      [LifeAspect.Luck]: 90
    };
  } else if (planetName === 'Rahu') {
    return {
      [LifeAspect.Finance]: 60,
      [LifeAspect.Romance]: 40,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 45,
      [LifeAspect.Growth]: 65,
      [LifeAspect.Career]: 75,
      [LifeAspect.Reputation]: 55,
      [LifeAspect.Spirituality]: 70,
      [LifeAspect.Luck]: 40
    };
  } else if (planetName === 'Mercury') {
    return {
      [LifeAspect.Finance]: 75,
      [LifeAspect.Romance]: 60,
      [LifeAspect.Education]: 95,
      [LifeAspect.Health]: 70,
      [LifeAspect.Family]: 65,
      [LifeAspect.Growth]: 85,
      [LifeAspect.Career]: 80,
      [LifeAspect.Reputation]: 70,
      [LifeAspect.Spirituality]: 60,
      [LifeAspect.Luck]: 75
    };
  } else if (planetName === 'Venus') {
    return {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 95,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 75,
      [LifeAspect.Family]: 85,
      [LifeAspect.Growth]: 65,
      [LifeAspect.Career]: 70,
      [LifeAspect.Reputation]: 80,
      [LifeAspect.Spirituality]: 60,
      [LifeAspect.Luck]: 75
    };
  } else if (planetName === 'Ketu') {
    return {
      [LifeAspect.Finance]: 50,
      [LifeAspect.Romance]: 40,
      [LifeAspect.Education]: 65,
      [LifeAspect.Health]: 55,
      [LifeAspect.Family]: 45,
      [LifeAspect.Growth]: 60,
      [LifeAspect.Career]: 55,
      [LifeAspect.Reputation]: 60,
      [LifeAspect.Spirituality]: 90,
      [LifeAspect.Luck]: 45
    };
  } else if (planetName === 'Saturn') {
    return {
      [LifeAspect.Finance]: 65,
      [LifeAspect.Romance]: 45,
      [LifeAspect.Education]: 80,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 60,
      [LifeAspect.Growth]: 70,
      [LifeAspect.Career]: 75,
      [LifeAspect.Reputation]: 65,
      [LifeAspect.Spirituality]: 75,
      [LifeAspect.Luck]: 40
    };
  } else if (planetName === 'Mars') {
    return {
      [LifeAspect.Finance]: 85,
      [LifeAspect.Romance]: 75,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 65,
      [LifeAspect.Family]: 60,
      [LifeAspect.Growth]: 80,
      [LifeAspect.Career]: 90,
      [LifeAspect.Reputation]: 85,
      [LifeAspect.Spirituality]: 55,
      [LifeAspect.Luck]: 70
    };
  }
  
  return defaultScores;
};

// For backward compatibility - no longer used directly but kept for API stability
export const calculateBirthPathNumber = (day: number, month: number, year: number): { steps: string; total: number; finalNumber: number } => {
  const lifeNumber = calculateLifeNumber(day, month, year);
  
  return {
    steps: lifeNumber.steps,
    total: lifeNumber.totalBeforeReduction,
    finalNumber: lifeNumber.finalNumber
  };
};

// For backward compatibility - no longer used as life number is now calculated from birth date only
export const calculateDestinyNumber = (birthPath: number, nameNumber: number): { steps: string; total: number; finalNumber: number } => {
  const total = birthPath + nameNumber;
  const steps = `${birthPath} + ${nameNumber} = ${total}`;
  const result = reduceToPythagoras(total);
  
  return {
    steps,
    total,
    finalNumber: result.finalNumber
  };
};
