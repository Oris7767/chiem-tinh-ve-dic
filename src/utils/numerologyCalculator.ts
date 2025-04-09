
// Core calculation functions
export const calculateNameNumber = (name: string): { steps: string; totalBeforeReduction: number; total: number; finalNumber: number } => {
  // Remove spaces and convert to uppercase
  const cleanName = name.replace(/\s+/g, '').toUpperCase();
  
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
  
  for (const char of cleanName) {
    if (letterMap[char]) {
      total += letterMap[char];
      letterValues.push(`${char}=${letterMap[char]}`);
    }
  }
  
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

// Main function to calculate all numerology values
export const calculateNumerology = ({ 
  fullName, 
  birthDay, 
  birthMonth, 
  birthYear,
  language = 'en'
}: { 
  fullName: string; 
  birthDay: number; 
  birthMonth: number; 
  birthYear: number;
  language: string;
}) => {
  // Calculate birth number
  const birthNumberResult = calculateBirthNumber(birthDay, birthMonth, birthYear);
  
  // Calculate name number
  const nameNumberResult = calculateNameNumber(fullName);
  
  // Calculate life number
  const lifeNumberResult = calculateLifeNumber(birthDay, birthMonth, birthYear);
  
  // Add meanings based on the numbers
  const getMeaning = (number: number): string => {
    // Here you would typically use translations or a database of meanings
    // For now, we'll use simple placeholders
    const meanings = {
      1: language === 'en' ? 
        "You are a natural leader with strong independence and creativity." : 
        "Bạn là một nhà lãnh đạo tự nhiên với sự độc lập và sáng tạo mạnh mẽ.",
      2: language === 'en' ? 
        "You are diplomatic and sensitive, with strong intuition and cooperation skills." : 
        "Bạn có tính ngoại giao và nhạy cảm, với trực giác mạnh mẽ và kỹ năng hợp tác.",
      3: language === 'en' ? 
        "You have excellent communication skills and artistic expression." : 
        "Bạn có kỹ năng giao tiếp và biểu đạt nghệ thuật tuyệt vời.",
      4: language === 'en' ? 
        "You are practical, disciplined and have strong organizational skills." : 
        "Bạn thực tế, kỷ luật và có kỹ năng tổ chức tốt.",
      5: language === 'en' ? 
        "You are adventurous, versatile, and value freedom." : 
        "Bạn phiêu lưu, linh hoạt và coi trọng sự tự do.",
      6: language === 'en' ? 
        "You are responsible, caring, and have a strong sense of harmony." : 
        "Bạn có trách nhiệm, biết quan tâm và có ý thức hài hòa mạnh mẽ.",
      7: language === 'en' ? 
        "You are analytical, introspective, and spiritually inclined." : 
        "Bạn có tính phân tích, nội tâm và có khuynh hướng tâm linh.",
      8: language === 'en' ? 
        "You have leadership abilities, ambition, and a strong focus on success." : 
        "Bạn có khả năng lãnh đạo, tham vọng và tập trung mạnh mẽ vào thành công.",
      9: language === 'en' ? 
        "You are compassionate, idealistic, and have a humanitarian outlook." : 
        "Bạn giàu lòng trắc ẩn, lý tưởng và có cái nhìn nhân đạo.",
    };
    
    return meanings[number as keyof typeof meanings] || 
      (language === 'en' ? 
        "This number carries complex and unique energies." : 
        "Con số này mang những năng lượng phức tạp và độc đáo.");
  };
  
  return {
    birthNumber: {
      calculation: birthNumberResult.steps,
      finalNumber: birthNumberResult.finalNumber,
      meaning: getMeaning(birthNumberResult.finalNumber)
    },
    nameNumber: {
      calculation: nameNumberResult.steps,
      finalNumber: nameNumberResult.finalNumber,
      meaning: getMeaning(nameNumberResult.finalNumber)
    },
    lifeNumber: {
      calculation: lifeNumberResult.steps,
      finalNumber: lifeNumberResult.finalNumber,
      meaning: getMeaning(lifeNumberResult.finalNumber)
    }
  };
};
