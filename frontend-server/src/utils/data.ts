export enum PlanetName {
  Sun = "Sun",
  Moon = "Moon",
  Jupiter = "Jupiter",
  Rahu = "Rahu",
  Mercury = "Mercury",
  Venus = "Venus",
  Ketu = "Ketu",
  Saturn = "Saturn",
  Mars = "Mars"
}

export enum LifeAspect {
  Finance = "Finance",
  Romance = "Romance",
  Education = "Education",
  Health = "Health",
  Family = "Family",
  Growth = "Growth",
  Career = "Career",
  Reputation = "Reputation",
  Spirituality = "Spirituality",
  Luck = "Luck"
}

export interface NumberMeaning {
  number: number;
  planetName: PlanetName;
  lifeAspects: Record<LifeAspect, number>;
}

// Function to get planet name based on number
export const getPlanetForNumber = (num: number): PlanetName => {
  // Reduce to a single digit or master number
  let reduced = num;
  while (reduced > 9) {
    reduced = Array.from(String(reduced), Number).reduce((a, b) => a + b, 0);
  }

  // Based on original Vedic numerology
  switch (reduced) {
    case 1: return PlanetName.Sun;
    case 2: return PlanetName.Moon;
    case 3: return PlanetName.Jupiter;
    case 4: return PlanetName.Rahu;
    case 5: return PlanetName.Mercury;
    case 6: return PlanetName.Venus;
    case 7: return PlanetName.Ketu;
    case 8: return PlanetName.Saturn;
    case 9: return PlanetName.Mars;
    default: return PlanetName.Sun; // Default case
  }
};

// Function to get life aspects for a number based on the data
export const getLifeAspectsForNumber = (num: number): Record<LifeAspect, number> => {
  // Find the number in our detailed meanings
  const numberData = numberMeanings.find(item => item.number === num);
  
  if (numberData) {
    return numberData.lifeAspects;
  }
  
  // Default values if not found
  return {
    [LifeAspect.Finance]: 50,
    [LifeAspect.Romance]: 50,
    [LifeAspect.Education]: 50,
    [LifeAspect.Health]: 50,
    [LifeAspect.Family]: 50,
    [LifeAspect.Growth]: 50,
    [LifeAspect.Career]: 50,
    [LifeAspect.Reputation]: 50,
    [LifeAspect.Spirituality]: 50,
    [LifeAspect.Luck]: 50
  };
};

// Data for all number meanings with associated aspects based on Vedic numerology
export const numberMeanings: NumberMeaning[] = [
  // SUN (1) numbers - 1, 10, 19, 28, 37, 46, 55, 64, 73, 82, 91, 100
  {
    number: 1,
    planetName: PlanetName.Sun,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 50,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 70,
      [LifeAspect.Family]: 60,
      [LifeAspect.Growth]: 80,
      [LifeAspect.Career]: 85,
      [LifeAspect.Reputation]: 75,
      [LifeAspect.Spirituality]: 60,
      [LifeAspect.Luck]: 70
    }
  },
  {
    number: 10,
    planetName: PlanetName.Sun,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 20,
      [LifeAspect.Education]: 10,
      [LifeAspect.Health]: 30,
      [LifeAspect.Family]: 60,
      [LifeAspect.Growth]: 70,
      [LifeAspect.Career]: 75,
      [LifeAspect.Reputation]: 85,
      [LifeAspect.Spirituality]: 50,
      [LifeAspect.Luck]: 60
    }
  },
  {
    number: 19,
    planetName: PlanetName.Sun,
    lifeAspects: {
      [LifeAspect.Finance]: 90,
      [LifeAspect.Romance]: 80,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 75,
      [LifeAspect.Growth]: 85,
      [LifeAspect.Career]: 90,
      [LifeAspect.Reputation]: 90,
      [LifeAspect.Spirituality]: 70,
      [LifeAspect.Luck]: 80
    }
  },
  {
    number: 28,
    planetName: PlanetName.Sun,
    lifeAspects: {
      [LifeAspect.Finance]: 20,
      [LifeAspect.Romance]: 10,
      [LifeAspect.Education]: 40,
      [LifeAspect.Health]: 30,
      [LifeAspect.Family]: 30,
      [LifeAspect.Growth]: 40,
      [LifeAspect.Career]: 30,
      [LifeAspect.Reputation]: 20,
      [LifeAspect.Spirituality]: 30,
      [LifeAspect.Luck]: 10
    }
  },
  {
    number: 37,
    planetName: PlanetName.Sun,
    lifeAspects: {
      [LifeAspect.Finance]: 90,
      [LifeAspect.Romance]: 80,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 80,
      [LifeAspect.Growth]: 85,
      [LifeAspect.Career]: 90,
      [LifeAspect.Reputation]: 85,
      [LifeAspect.Spirituality]: 70,
      [LifeAspect.Luck]: 80
    }
  },
  {
    number: 46,
    planetName: PlanetName.Sun,
    lifeAspects: {
      [LifeAspect.Finance]: 90,
      [LifeAspect.Romance]: 80,
      [LifeAspect.Education]: 80,
      [LifeAspect.Health]: 70,
      [LifeAspect.Family]: 75,
      [LifeAspect.Growth]: 85,
      [LifeAspect.Career]: 90,
      [LifeAspect.Reputation]: 90,
      [LifeAspect.Spirituality]: 70,
      [LifeAspect.Luck]: 85
    }
  },
  {
    number: 55,
    planetName: PlanetName.Sun,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 90,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 70,
      [LifeAspect.Growth]: 85,
      [LifeAspect.Career]: 85,
      [LifeAspect.Reputation]: 85,
      [LifeAspect.Spirituality]: 80,
      [LifeAspect.Luck]: 75
    }
  },
  {
    number: 64,
    planetName: PlanetName.Sun,
    lifeAspects: {
      [LifeAspect.Finance]: 70,
      [LifeAspect.Romance]: 60,
      [LifeAspect.Education]: 80,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 65,
      [LifeAspect.Growth]: 75,
      [LifeAspect.Career]: 85,
      [LifeAspect.Reputation]: 80,
      [LifeAspect.Spirituality]: 65,
      [LifeAspect.Luck]: 70
    }
  },
  {
    number: 73,
    planetName: PlanetName.Sun,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 70,
      [LifeAspect.Growth]: 75,
      [LifeAspect.Career]: 80,
      [LifeAspect.Reputation]: 85,
      [LifeAspect.Spirituality]: 70,
      [LifeAspect.Luck]: 75
    }
  },
  {
    number: 82,
    planetName: PlanetName.Sun,
    lifeAspects: {
      [LifeAspect.Finance]: 90,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 80,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 75,
      [LifeAspect.Growth]: 85,
      [LifeAspect.Career]: 90,
      [LifeAspect.Reputation]: 90,
      [LifeAspect.Spirituality]: 70,
      [LifeAspect.Luck]: 85
    }
  },
  {
    number: 91,
    planetName: PlanetName.Sun,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 60,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 65,
      [LifeAspect.Growth]: 75,
      [LifeAspect.Career]: 70,
      [LifeAspect.Reputation]: 75,
      [LifeAspect.Spirituality]: 60,
      [LifeAspect.Luck]: 70
    }
  },
  {
    number: 100,
    planetName: PlanetName.Sun,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 60,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 60,
      [LifeAspect.Growth]: 65,
      [LifeAspect.Career]: 60,
      [LifeAspect.Reputation]: 65,
      [LifeAspect.Spirituality]: 50,
      [LifeAspect.Luck]: 55
    }
  },
  
  // MOON (2) numbers - 2, 11, 20, 29, 38, 47, 56, 65, 74, 83, 92, 101
  {
    number: 2,
    planetName: PlanetName.Moon,
    lifeAspects: {
      [LifeAspect.Finance]: 60,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 80,
      [LifeAspect.Growth]: 65,
      [LifeAspect.Career]: 70,
      [LifeAspect.Reputation]: 65,
      [LifeAspect.Spirituality]: 75,
      [LifeAspect.Luck]: 65
    }
  },
  {
    number: 11,
    planetName: PlanetName.Moon,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 70,
      [LifeAspect.Growth]: 75,
      [LifeAspect.Career]: 70,
      [LifeAspect.Reputation]: 65,
      [LifeAspect.Spirituality]: 85,
      [LifeAspect.Luck]: 70
    }
  },
  {
    number: 20,
    planetName: PlanetName.Moon,
    lifeAspects: {
      [LifeAspect.Finance]: 70,
      [LifeAspect.Romance]: 50,
      [LifeAspect.Education]: 80,
      [LifeAspect.Health]: 40,
      [LifeAspect.Family]: 55,
      [LifeAspect.Growth]: 65,
      [LifeAspect.Career]: 60,
      [LifeAspect.Reputation]: 70,
      [LifeAspect.Spirituality]: 75,
      [LifeAspect.Luck]: 45
    }
  },
  {
    number: 29,
    planetName: PlanetName.Moon,
    lifeAspects: {
      [LifeAspect.Finance]: 40,
      [LifeAspect.Romance]: 20,
      [LifeAspect.Education]: 50,
      [LifeAspect.Health]: 30,
      [LifeAspect.Family]: 20,
      [LifeAspect.Growth]: 40,
      [LifeAspect.Career]: 30,
      [LifeAspect.Reputation]: 25,
      [LifeAspect.Spirituality]: 30,
      [LifeAspect.Luck]: 20
    }
  },
  {
    number: 38,
    planetName: PlanetName.Moon,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 75,
      [LifeAspect.Growth]: 70,
      [LifeAspect.Career]: 75,
      [LifeAspect.Reputation]: 80,
      [LifeAspect.Spirituality]: 65,
      [LifeAspect.Luck]: 60
    }
  },
  {
    number: 47,
    planetName: PlanetName.Moon,
    lifeAspects: {
      [LifeAspect.Finance]: 90,
      [LifeAspect.Romance]: 80,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 40,
      [LifeAspect.Family]: 75,
      [LifeAspect.Growth]: 85,
      [LifeAspect.Career]: 80,
      [LifeAspect.Reputation]: 75,
      [LifeAspect.Spirituality]: 60,
      [LifeAspect.Luck]: 80
    }
  },
  {
    number: 56,
    planetName: PlanetName.Moon,
    lifeAspects: {
      [LifeAspect.Finance]: 40,
      [LifeAspect.Romance]: 30,
      [LifeAspect.Education]: 50,
      [LifeAspect.Health]: 20,
      [LifeAspect.Family]: 35,
      [LifeAspect.Growth]: 30,
      [LifeAspect.Career]: 40,
      [LifeAspect.Reputation]: 35,
      [LifeAspect.Spirituality]: 60,
      [LifeAspect.Luck]: 25
    }
  },
  {
    number: 65,
    planetName: PlanetName.Moon,
    lifeAspects: {
      [LifeAspect.Finance]: 70,
      [LifeAspect.Romance]: 80,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 75,
      [LifeAspect.Growth]: 65,
      [LifeAspect.Career]: 70,
      [LifeAspect.Reputation]: 75,
      [LifeAspect.Spirituality]: 85,
      [LifeAspect.Luck]: 70
    }
  },
  {
    number: 74,
    planetName: PlanetName.Moon,
    lifeAspects: {
      [LifeAspect.Finance]: 40,
      [LifeAspect.Romance]: 30,
      [LifeAspect.Education]: 50,
      [LifeAspect.Health]: 20,
      [LifeAspect.Family]: 45,
      [LifeAspect.Growth]: 40,
      [LifeAspect.Career]: 35,
      [LifeAspect.Reputation]: 50,
      [LifeAspect.Spirituality]: 70,
      [LifeAspect.Luck]: 25
    }
  },
  {
    number: 83,
    planetName: PlanetName.Moon,
    lifeAspects: {
      [LifeAspect.Finance]: 90,
      [LifeAspect.Romance]: 80,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 85,
      [LifeAspect.Growth]: 80,
      [LifeAspect.Career]: 90,
      [LifeAspect.Reputation]: 90,
      [LifeAspect.Spirituality]: 75,
      [LifeAspect.Luck]: 80
    }
  },
  {
    number: 92,
    planetName: PlanetName.Moon,
    lifeAspects: {
      [LifeAspect.Finance]: 90,
      [LifeAspect.Romance]: 80,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 75,
      [LifeAspect.Growth]: 80,
      [LifeAspect.Career]: 75,
      [LifeAspect.Reputation]: 80,
      [LifeAspect.Spirituality]: 85,
      [LifeAspect.Luck]: 75
    }
  },
  {
    number: 101,
    planetName: PlanetName.Moon,
    lifeAspects: {
      [LifeAspect.Finance]: 40,
      [LifeAspect.Romance]: 30,
      [LifeAspect.Education]: 50,
      [LifeAspect.Health]: 20,
      [LifeAspect.Family]: 45,
      [LifeAspect.Growth]: 40,
      [LifeAspect.Career]: 30,
      [LifeAspect.Reputation]: 35,
      [LifeAspect.Spirituality]: 45,
      [LifeAspect.Luck]: 20
    }
  },
  
  // JUPITER (3) numbers - 3, 12, 21, 30, 39, 48, 57, 66, 75, 84, 93, 102
  {
    number: 3,
    planetName: PlanetName.Jupiter,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 60,
      [LifeAspect.Education]: 90,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 75,
      [LifeAspect.Growth]: 75,
      [LifeAspect.Career]: 75,
      [LifeAspect.Reputation]: 80,
      [LifeAspect.Spirituality]: 70,
      [LifeAspect.Luck]: 75
    }
  },
  {
    number: 12,
    planetName: PlanetName.Jupiter,
    lifeAspects: {
      [LifeAspect.Finance]: 70,
      [LifeAspect.Romance]: 80,
      [LifeAspect.Education]: 80,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 85,
      [LifeAspect.Growth]: 70,
      [LifeAspect.Career]: 65,
      [LifeAspect.Reputation]: 75,
      [LifeAspect.Spirituality]: 75,
      [LifeAspect.Luck]: 70
    }
  },
  {
    number: 21,
    planetName: PlanetName.Jupiter,
    lifeAspects: {
      [LifeAspect.Finance]: 90,
      [LifeAspect.Romance]: 80,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 70,
      [LifeAspect.Growth]: 85,
      [LifeAspect.Career]: 85,
      [LifeAspect.Reputation]: 80,
      [LifeAspect.Spirituality]: 65,
      [LifeAspect.Luck]: 80
    }
  },
  {
    number: 30,
    planetName: PlanetName.Jupiter,
    lifeAspects: {
      [LifeAspect.Finance]: 60,
      [LifeAspect.Romance]: 50,
      [LifeAspect.Education]: 80,
      [LifeAspect.Health]: 40,
      [LifeAspect.Family]: 60,
      [LifeAspect.Growth]: 70,
      [LifeAspect.Career]: 55,
      [LifeAspect.Reputation]: 65,
      [LifeAspect.Spirituality]: 80,
      [LifeAspect.Luck]: 50
    }
  },
  {
    number: 39,
    planetName: PlanetName.Jupiter,
    lifeAspects: {
      [LifeAspect.Finance]: 50,
      [LifeAspect.Romance]: 40,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 30,
      [LifeAspect.Family]: 60,
      [LifeAspect.Growth]: 55,
      [LifeAspect.Career]: 50,
      [LifeAspect.Reputation]: 65,
      [LifeAspect.Spirituality]: 60,
      [LifeAspect.Luck]: 45
    }
  },
  {
    number: 48,
    planetName: PlanetName.Jupiter,
    lifeAspects: {
      [LifeAspect.Finance]: 40,
      [LifeAspect.Romance]: 30,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 20,
      [LifeAspect.Family]: 45,
      [LifeAspect.Growth]: 40,
      [LifeAspect.Career]: 35,
      [LifeAspect.Reputation]: 50,
      [LifeAspect.Spirituality]: 75,
      [LifeAspect.Luck]: 30
    }
  },
  {
    number: 57,
    planetName: PlanetName.Jupiter,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 65,
      [LifeAspect.Growth]: 70,
      [LifeAspect.Career]: 75,
      [LifeAspect.Reputation]: 70,
      [LifeAspect.Spirituality]: 60,
      [LifeAspect.Luck]: 65
    }
  },
  {
    number: 66,
    planetName: PlanetName.Jupiter,
    lifeAspects: {
      [LifeAspect.Finance]: 90,
      [LifeAspect.Romance]: 80,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 85,
      [LifeAspect.Growth]: 80,
      [LifeAspect.Career]: 85,
      [LifeAspect.Reputation]: 90,
      [LifeAspect.Spirituality]: 75,
      [LifeAspect.Luck]: 80
    }
  },
  {
    number: 75,
    planetName: PlanetName.Jupiter,
    lifeAspects: {
      [LifeAspect.Finance]: 90,
      [LifeAspect.Romance]: 80,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 75,
      [LifeAspect.Growth]: 85,
      [LifeAspect.Career]: 80,
      [LifeAspect.Reputation]: 90,
      [LifeAspect.Spirituality]: 70,
      [LifeAspect.Luck]: 85
    }
  },
  {
    number: 84,
    planetName: PlanetName.Jupiter,
    lifeAspects: {
      [LifeAspect.Finance]: 50,
      [LifeAspect.Romance]: 40,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 30,
      [LifeAspect.Family]: 55,
      [LifeAspect.Growth]: 50,
      [LifeAspect.Career]: 45,
      [LifeAspect.Reputation]: 60,
      [LifeAspect.Spirituality]: 70,
      [LifeAspect.Luck]: 40
    }
  },
  {
    number: 93,
    planetName: PlanetName.Jupiter,
    lifeAspects: {
      [LifeAspect.Finance]: 90,
      [LifeAspect.Romance]: 80,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 75,
      [LifeAspect.Growth]: 85,
      [LifeAspect.Career]: 80,
      [LifeAspect.Reputation]: 85,
      [LifeAspect.Spirituality]: 70,
      [LifeAspect.Luck]: 80
    }
  },
  {
    number: 102,
    planetName: PlanetName.Jupiter,
    lifeAspects: {
      [LifeAspect.Finance]: 60,
      [LifeAspect.Romance]: 50,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 40,
      [LifeAspect.Family]: 55,
      [LifeAspect.Growth]: 50,
      [LifeAspect.Career]: 55,
      [LifeAspect.Reputation]: 60,
      [LifeAspect.Spirituality]: 55,
      [LifeAspect.Luck]: 45
    }
  },
  
  // RAHU (4) numbers - 4, 13, 22, 31, 40, 49, 58, 67, 76, 85, 94, 103
  {
    number: 4,
    planetName: PlanetName.Rahu,
    lifeAspects: {
      [LifeAspect.Finance]: 30,
      [LifeAspect.Romance]: 20,
      [LifeAspect.Education]: 40,
      [LifeAspect.Health]: 30,
      [LifeAspect.Family]: 50,
      [LifeAspect.Growth]: 40,
      [LifeAspect.Career]: 60,
      [LifeAspect.Reputation]: 40,
      [LifeAspect.Spirituality]: 30,
      [LifeAspect.Luck]: 20
    }
  },
  {
    number: 13,
    planetName: PlanetName.Rahu,
    lifeAspects: {
      [LifeAspect.Finance]: 20,
      [LifeAspect.Romance]: 10,
      [LifeAspect.Education]: 30,
      [LifeAspect.Health]: 20,
      [LifeAspect.Family]: 30,
      [LifeAspect.Growth]: 25,
      [LifeAspect.Career]: 25,
      [LifeAspect.Reputation]: 20,
      [LifeAspect.Spirituality]: 25,
      [LifeAspect.Luck]: 10
    }
  },
  {
    number: 22,
    planetName: PlanetName.Rahu,
    lifeAspects: {
      [LifeAspect.Finance]: 30,
      [LifeAspect.Romance]: 20,
      [LifeAspect.Education]: 50,
      [LifeAspect.Health]: 20,
      [LifeAspect.Family]: 25,
      [LifeAspect.Growth]: 40,
      [LifeAspect.Career]: 45,
      [LifeAspect.Reputation]: 30,
      [LifeAspect.Spirituality]: 20,
      [LifeAspect.Luck]: 25
    }
  },
  {
    number: 31,
    planetName: PlanetName.Rahu,
    lifeAspects: {
      [LifeAspect.Finance]: 40,
      [LifeAspect.Romance]: 20,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 30,
      [LifeAspect.Family]: 45,
      [LifeAspect.Growth]: 55,
      [LifeAspect.Career]: 50,
      [LifeAspect.Reputation]: 45,
      [LifeAspect.Spirituality]: 65,
      [LifeAspect.Luck]: 30
    }
  },
  {
    number: 40,
    planetName: PlanetName.Rahu,
    lifeAspects: {
      [LifeAspect.Finance]: 50,
      [LifeAspect.Romance]: 30,
      [LifeAspect.Education]: 40,
      [LifeAspect.Health]: 20,
      [LifeAspect.Family]: 45,
      [LifeAspect.Growth]: 40,
      [LifeAspect.Career]: 45,
      [LifeAspect.Reputation]: 50,
      [LifeAspect.Spirituality]: 30,
      [LifeAspect.Luck]: 25
    }
  },
  {
    number: 49,
    planetName: PlanetName.Rahu,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 60,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 40,
      [LifeAspect.Family]: 65,
      [LifeAspect.Growth]: 75,
      [LifeAspect.Career]: 70,
      [LifeAspect.Reputation]: 75,
      [LifeAspect.Spirituality]: 60,
      [LifeAspect.Luck]: 65
    }
  },
  {
    number: 58,
    planetName: PlanetName.Rahu,
    lifeAspects: {
      [LifeAspect.Finance]: 70,
      [LifeAspect.Romance]: 50,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 40,
      [LifeAspect.Family]: 60,
      [LifeAspect.Growth]: 65,
      [LifeAspect.Career]: 70,
      [LifeAspect.Reputation]: 75,
      [LifeAspect.Spirituality]: 55,
      [LifeAspect.Luck]: 60
    }
  },
  {
    number: 67,
    planetName: PlanetName.Rahu,
    lifeAspects: {
      [LifeAspect.Finance]: 60,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 50,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 65,
      [LifeAspect.Growth]: 60,
      [LifeAspect.Career]: 55,
      [LifeAspect.Reputation]: 65,
      [LifeAspect.Spirituality]: 60,
      [LifeAspect.Luck]: 55
    }
  },
  {
    number: 76,
    planetName: PlanetName.Rahu,
    lifeAspects: {
      [LifeAspect.Finance]: 40,
      [LifeAspect.Romance]: 20,
      [LifeAspect.Education]: 30,
      [LifeAspect.Health]: 30,
      [LifeAspect.Family]: 45,
      [LifeAspect.Growth]: 35,
      [LifeAspect.Career]: 40,
      [LifeAspect.Reputation]: 50,
      [LifeAspect.Spirituality]: 45,
      [LifeAspect.Luck]: 35
    }
  },
  {
    number: 85,
    planetName: PlanetName.Rahu,
    lifeAspects: {
      [LifeAspect.Finance]: 70,
      [LifeAspect.Romance]: 60,
      [LifeAspect.Education]: 80,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 70,
      [LifeAspect.Growth]: 75,
      [LifeAspect.Career]: 70,
      [LifeAspect.Reputation]: 75,
      [LifeAspect.Spirituality]: 70,
      [LifeAspect.Luck]: 65
    }
  },
  {
    number: 94,
    planetName: PlanetName.Rahu,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 75,
      [LifeAspect.Growth]: 75,
      [LifeAspect.Career]: 70,
      [LifeAspect.Reputation]: 80,
      [LifeAspect.Spirituality]: 75,
      [LifeAspect.Luck]: 70
    }
  },
  {
    number: 103,
    planetName: PlanetName.Rahu,
    lifeAspects: {
      [LifeAspect.Finance]: 70,
      [LifeAspect.Romance]: 60,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 65,
      [LifeAspect.Growth]: 65,
      [LifeAspect.Career]: 65,
      [LifeAspect.Reputation]: 70,
      [LifeAspect.Spirituality]: 60,
      [LifeAspect.Luck]: 60
    }
  },
  
  // MERCURY (5) numbers - 5, 14, 23, 32, 41, 50, 59, 68, 77, 86, 95, 104
  {
    number: 5,
    planetName: PlanetName.Mercury,
    lifeAspects: {
      [LifeAspect.Finance]: 70,
      [LifeAspect.Romance]: 80,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 60,
      [LifeAspect.Growth]: 80,
      [LifeAspect.Career]: 75,
      [LifeAspect.Reputation]: 70,
      [LifeAspect.Spirituality]: 65,
      [LifeAspect.Luck]: 75
    }
  },
  {
    number: 14,
    planetName: PlanetName.Mercury,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 40,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 55,
      [LifeAspect.Growth]: 75,
      [LifeAspect.Career]: 70,
      [LifeAspect.Reputation]: 65,
      [LifeAspect.Spirituality]: 60,
      [LifeAspect.Luck]: 75
    }
  },
  {
    number: 23,
    planetName: PlanetName.Mercury,
    lifeAspects: {
      [LifeAspect.Finance]: 90,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 80,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 75,
      [LifeAspect.Growth]: 85,
      [LifeAspect.Career]: 90,
      [LifeAspect.Reputation]: 85,
      [LifeAspect.Spirituality]: 70,
      [LifeAspect.Luck]: 85
    }
  },
  {
    number: 32,
    planetName: PlanetName.Mercury,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 90,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 70,
      [LifeAspect.Growth]: 85,
      [LifeAspect.Career]: 80,
      [LifeAspect.Reputation]: 75,
      [LifeAspect.Spirituality]: 70,
      [LifeAspect.Luck]: 75
    }
  },
  {
    number: 41,
    planetName: PlanetName.Mercury,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 70,
      [LifeAspect.Growth]: 75,
      [LifeAspect.Career]: 80,
      [LifeAspect.Reputation]: 75,
      [LifeAspect.Spirituality]: 65,
      [LifeAspect.Luck]: 70
    }
  },
  {
    number: 50,
    planetName: PlanetName.Mercury,
    lifeAspects: {
      [LifeAspect.Finance]: 70,
      [LifeAspect.Romance]: 60,
      [LifeAspect.Education]: 90,
      [LifeAspect.Health]: 70,
      [LifeAspect.Family]: 65,
      [LifeAspect.Growth]: 75,
      [LifeAspect.Career]: 75,
      [LifeAspect.Reputation]: 70,
      [LifeAspect.Spirituality]: 65,
      [LifeAspect.Luck]: 70
    }
  },
  {
    number: 59,
    planetName: PlanetName.Mercury,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 60,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 65,
      [LifeAspect.Growth]: 75,
      [LifeAspect.Career]: 80,
      [LifeAspect.Reputation]: 75,
      [LifeAspect.Spirituality]: 60,
      [LifeAspect.Luck]: 70
    }
  },
  {
    number: 68,
    planetName: PlanetName.Mercury,
    lifeAspects: {
      [LifeAspect.Finance]: 50,
      [LifeAspect.Romance]: 40,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 30,
      [LifeAspect.Family]: 45,
      [LifeAspect.Growth]: 50,
      [LifeAspect.Career]: 45,
      [LifeAspect.Reputation]: 55,
      [LifeAspect.Spirituality]: 40,
      [LifeAspect.Luck]: 40
    }
  },
  {
    number: 77,
    planetName: PlanetName.Mercury,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 80,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 75,
      [LifeAspect.Growth]: 80,
      [LifeAspect.Career]: 75,
      [LifeAspect.Reputation]: 80,
      [LifeAspect.Spirituality]: 85,
      [LifeAspect.Luck]: 75
    }
  },
  {
    number: 86,
    planetName: PlanetName.Mercury,
    lifeAspects: {
      [LifeAspect.Finance]: 70,
      [LifeAspect.Romance]: 60,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 70,
      [LifeAspect.Growth]: 65,
      [LifeAspect.Career]: 70,
      [LifeAspect.Reputation]: 65,
      [LifeAspect.Spirituality]: 60,
      [LifeAspect.Luck]: 65
    }
  },
  {
    number: 95,
    planetName: PlanetName.Mercury,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 80,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 70,
      [LifeAspect.Growth]: 80,
      [LifeAspect.Career]: 85,
      [LifeAspect.Reputation]: 80,
      [LifeAspect.Spirituality]: 65,
      [LifeAspect.Luck]: 75
    }
  },
  {
    number: 104,
    planetName: PlanetName.Mercury,
    lifeAspects: {
      [LifeAspect.Finance]: 50,
      [LifeAspect.Romance]: 40,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 30,
      [LifeAspect.Family]: 45,
      [LifeAspect.Growth]: 55,
      [LifeAspect.Career]: 50,
      [LifeAspect.Reputation]: 65,
      [LifeAspect.Spirituality]: 45,
      [LifeAspect.Luck]: 35
    }
  },
  
  // VENUS (6) numbers - 6, 15, 24, 33, 42, 51, 60, 69, 78, 87, 96, 105
  {
    number: 6,
    planetName: PlanetName.Venus,
    lifeAspects: {
      [LifeAspect.Finance]: 60,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 50,
      [LifeAspect.Health]: 80,
      [LifeAspect.Family]: 90,
      [LifeAspect.Growth]: 70,
      [LifeAspect.Career]: 75,
      [LifeAspect.Reputation]: 80,
      [LifeAspect.Spirituality]: 75,
      [LifeAspect.Luck]: 70
    }
  },
  {
    number: 15,
    planetName: PlanetName.Venus,
    lifeAspects: {
      [LifeAspect.Finance]: 90,
      [LifeAspect.Romance]: 80,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 70,
      [LifeAspect.Family]: 75,
      [LifeAspect.Growth]: 85,
      [LifeAspect.Career]: 80,
      [LifeAspect.Reputation]: 75,
      [LifeAspect.Spirituality]: 50,
      [LifeAspect.Luck]: 85
    }
  },
  {
    number: 24,
    planetName: PlanetName.Venus,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 70,
      [LifeAspect.Family]: 75,
      [LifeAspect.Growth]: 75,
      [LifeAspect.Career]: 90,
      [LifeAspect.Reputation]: 85,
      [LifeAspect.Spirituality]: 65,
      [LifeAspect.Luck]: 80
    }
  },
  {
    number: 33,
    planetName: PlanetName.Venus,
    lifeAspects: {
      [LifeAspect.Finance]: 90,
      [LifeAspect.Romance]: 80,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 80,
      [LifeAspect.Family]: 90,
      [LifeAspect.Growth]: 85,
      [LifeAspect.Career]: 85,
      [LifeAspect.Reputation]: 90,
      [LifeAspect.Spirituality]: 90,
      [LifeAspect.Luck]: 85
    }
  },
  {
    number: 42,
    planetName: PlanetName.Venus,
    lifeAspects: {
      [LifeAspect.Finance]: 70,
      [LifeAspect.Romance]: 60,
      [LifeAspect.Education]: 50,
      [LifeAspect.Health]: 70,
      [LifeAspect.Family]: 75,
      [LifeAspect.Growth]: 65,
      [LifeAspect.Career]: 70,
      [LifeAspect.Reputation]: 65,
      [LifeAspect.Spirituality]: 60,
      [LifeAspect.Luck]: 65
    }
  },
  {
    number: 51,
    planetName: PlanetName.Venus,
    lifeAspects: {
      [LifeAspect.Finance]: 90,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 80,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 70,
      [LifeAspect.Growth]: 85,
      [LifeAspect.Career]: 85,
      [LifeAspect.Reputation]: 80,
      [LifeAspect.Spirituality]: 65,
      [LifeAspect.Luck]: 80
    }
  },
  {
    number: 60,
    planetName: PlanetName.Venus,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 70,
      [LifeAspect.Family]: 85,
      [LifeAspect.Growth]: 75,
      [LifeAspect.Career]: 75,
      [LifeAspect.Reputation]: 80,
      [LifeAspect.Spirituality]: 75,
      [LifeAspect.Luck]: 75
    }
  },
  {
    number: 69,
    planetName: PlanetName.Venus,
    lifeAspects: {
      [LifeAspect.Finance]: 90,
      [LifeAspect.Romance]: 80,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 70,
      [LifeAspect.Family]: 80,
      [LifeAspect.Growth]: 85,
      [LifeAspect.Career]: 90,
      [LifeAspect.Reputation]: 90,
      [LifeAspect.Spirituality]: 65,
      [LifeAspect.Luck]: 85
    }
  },
  {
    number: 78,
    planetName: PlanetName.Venus,
    lifeAspects: {
      [LifeAspect.Finance]: 70,
      [LifeAspect.Romance]: 60,
      [LifeAspect.Education]: 80,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 75,
      [LifeAspect.Growth]: 70,
      [LifeAspect.Career]: 65,
      [LifeAspect.Reputation]: 75,
      [LifeAspect.Spirituality]: 85,
      [LifeAspect.Luck]: 70
    }
  },
  {
    number: 87,
    planetName: PlanetName.Venus,
    lifeAspects: {
      [LifeAspect.Finance]: 30,
      [LifeAspect.Romance]: 20,
      [LifeAspect.Education]: 40,
      [LifeAspect.Health]: 10,
      [LifeAspect.Family]: 25,
      [LifeAspect.Growth]: 30,
      [LifeAspect.Career]: 25,
      [LifeAspect.Reputation]: 20,
      [LifeAspect.Spirituality]: 60,
      [LifeAspect.Luck]: 15
    }
  },
  {
    number: 96,
    planetName: PlanetName.Venus,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 90,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 85,
      [LifeAspect.Growth]: 75,
      [LifeAspect.Career]: 75,
      [LifeAspect.Reputation]: 80,
      [LifeAspect.Spirituality]: 75,
      [LifeAspect.Luck]: 85
    }
  },
  {
    number: 105,
    planetName: PlanetName.Venus,
    lifeAspects: {
      [LifeAspect.Finance]: 90,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 80,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 75,
      [LifeAspect.Growth]: 80,
      [LifeAspect.Career]: 85,
      [LifeAspect.Reputation]: 80,
      [LifeAspect.Spirituality]: 70,
      [LifeAspect.Luck]: 80
    }
  },
  
  // KETU (7) numbers - 7, 16, 25, 34, 43, 52, 61, 70, 79, 88, 97, 106
  {
    number: 7,
    planetName: PlanetName.Ketu,
    lifeAspects: {
      [LifeAspect.Finance]: 40,
      [LifeAspect.Romance]: 30,
      [LifeAspect.Education]: 50,
      [LifeAspect.Health]: 30,
      [LifeAspect.Family]: 65,
      [LifeAspect.Growth]: 75,
      [LifeAspect.Career]: 70,
      [LifeAspect.Reputation]: 70,
      [LifeAspect.Spirituality]: 90,
      [LifeAspect.Luck]: 65
    }
  },
  {
    number: 16,
    planetName: PlanetName.Ketu,
    lifeAspects: {
      [LifeAspect.Finance]: 20,
      [LifeAspect.Romance]: 10,
      [LifeAspect.Education]: 40,
      [LifeAspect.Health]: 30,
      [LifeAspect.Family]: 25,
      [LifeAspect.Growth]: 30,
      [LifeAspect.Career]: 25,
      [LifeAspect.Reputation]: 20,
      [LifeAspect.Spirituality]: 35,
      [LifeAspect.Luck]: 15
    }
  },
  {
    number: 25,
    planetName: PlanetName.Ketu,
    lifeAspects: {
      [LifeAspect.Finance]: 60,
      [LifeAspect.Romance]: 50,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 55,
      [LifeAspect.Growth]: 65,
      [LifeAspect.Career]: 60,
      [LifeAspect.Reputation]: 65,
      [LifeAspect.Spirituality]: 75,
      [LifeAspect.Luck]: 55
    }
  },
  {
    number: 34,
    planetName: PlanetName.Ketu,
    lifeAspects: {
      [LifeAspect.Finance]: 50,
      [LifeAspect.Romance]: 40,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 40,
      [LifeAspect.Family]: 45,
      [LifeAspect.Growth]: 55,
      [LifeAspect.Career]: 50,
      [LifeAspect.Reputation]: 45,
      [LifeAspect.Spirituality]: 60,
      [LifeAspect.Luck]: 40
    }
  },
  {
    number: 43,
    planetName: PlanetName.Ketu,
    lifeAspects: {
      [LifeAspect.Finance]: 40,
      [LifeAspect.Romance]: 30,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 30,
      [LifeAspect.Family]: 45,
      [LifeAspect.Growth]: 60,
      [LifeAspect.Career]: 50,
      [LifeAspect.Reputation]: 45,
      [LifeAspect.Spirituality]: 70,
      [LifeAspect.Luck]: 40
    }
  },
  {
    number: 52,
    planetName: PlanetName.Ketu,
    lifeAspects: {
      [LifeAspect.Finance]: 60,
      [LifeAspect.Romance]: 50,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 40,
      [LifeAspect.Family]: 55,
      [LifeAspect.Growth]: 65,
      [LifeAspect.Career]: 60,
      [LifeAspect.Reputation]: 70,
      [LifeAspect.Spirituality]: 80,
      [LifeAspect.Luck]: 60
    }
  },
  {
    number: 61,
    planetName: PlanetName.Ketu,
    lifeAspects: {
      [LifeAspect.Finance]: 60,
      [LifeAspect.Romance]: 40,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 40,
      [LifeAspect.Family]: 45,
      [LifeAspect.Growth]: 60,
      [LifeAspect.Career]: 65,
      [LifeAspect.Reputation]: 70,
      [LifeAspect.Spirituality]: 65,
      [LifeAspect.Luck]: 55
    }
  },
  {
    number: 70,
    planetName: PlanetName.Ketu,
    lifeAspects: {
      [LifeAspect.Finance]: 30,
      [LifeAspect.Romance]: 20,
      [LifeAspect.Education]: 40,
      [LifeAspect.Health]: 30,
      [LifeAspect.Family]: 35,
      [LifeAspect.Growth]: 40,
      [LifeAspect.Career]: 35,
      [LifeAspect.Reputation]: 40,
      [LifeAspect.Spirituality]: 60,
      [LifeAspect.Luck]: 30
    }
  },
  {
    number: 79,
    planetName: PlanetName.Ketu,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 70,
      [LifeAspect.Growth]: 75,
      [LifeAspect.Career]: 75,
      [LifeAspect.Reputation]: 80,
      [LifeAspect.Spirituality]: 75,
      [LifeAspect.Luck]: 75
    }
  },
  {
    number: 88,
    planetName: PlanetName.Ketu,
    lifeAspects: {
      [LifeAspect.Finance]: 60,
      [LifeAspect.Romance]: 50,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 70,
      [LifeAspect.Growth]: 65,
      [LifeAspect.Career]: 60,
      [LifeAspect.Reputation]: 65,
      [LifeAspect.Spirituality]: 90,
      [LifeAspect.Luck]: 65
    }
  },
  {
    number: 97,
    planetName: PlanetName.Ketu,
    lifeAspects: {
      [LifeAspect.Finance]: 70,
      [LifeAspect.Romance]: 60,
      [LifeAspect.Education]: 80,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 70,
      [LifeAspect.Growth]: 75,
      [LifeAspect.Career]: 70,
      [LifeAspect.Reputation]: 75,
      [LifeAspect.Spirituality]: 90,
      [LifeAspect.Luck]: 70
    }
  },
  {
    number: 106,
    planetName: PlanetName.Ketu,
    lifeAspects: {
      [LifeAspect.Finance]: 40,
      [LifeAspect.Romance]: 30,
      [LifeAspect.Education]: 50,
      [LifeAspect.Health]: 30,
      [LifeAspect.Family]: 35,
      [LifeAspect.Growth]: 40,
      [LifeAspect.Career]: 35,
      [LifeAspect.Reputation]: 40,
      [LifeAspect.Spirituality]: 50,
      [LifeAspect.Luck]: 30
    }
  },
  
  // SATURN (8) numbers - 8, 17, 26, 35, 44, 53, 62, 71, 80, 89, 98, 107
  {
    number: 8,
    planetName: PlanetName.Saturn,
    lifeAspects: {
      [LifeAspect.Finance]: 40,
      [LifeAspect.Romance]: 30,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 65,
      [LifeAspect.Growth]: 80,
      [LifeAspect.Career]: 90,
      [LifeAspect.Reputation]: 80,
      [LifeAspect.Spirituality]: 60,
      [LifeAspect.Luck]: 75
    }
  },
  {
    number: 17,
    planetName: PlanetName.Saturn,
    lifeAspects: {
      [LifeAspect.Finance]: 70,
      [LifeAspect.Romance]: 50,
      [LifeAspect.Education]: 80,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 60,
      [LifeAspect.Growth]: 75,
      [LifeAspect.Career]: 80,
      [LifeAspect.Reputation]: 75,
      [LifeAspect.Spirituality]: 70,
      [LifeAspect.Luck]: 65
    }
  },
  {
    number: 26,
    planetName: PlanetName.Saturn,
    lifeAspects: {
      [LifeAspect.Finance]: 40,
      [LifeAspect.Romance]: 20,
      [LifeAspect.Education]: 40,
      [LifeAspect.Health]: 30,
      [LifeAspect.Family]: 35,
      [LifeAspect.Growth]: 35,
      [LifeAspect.Career]: 40,
      [LifeAspect.Reputation]: 30,
      [LifeAspect.Spirituality]: 45,
      [LifeAspect.Luck]: 25
    }
  },
  {
    number: 35,
    planetName: PlanetName.Saturn,
    lifeAspects: {
      [LifeAspect.Finance]: 30,
      [LifeAspect.Romance]: 20,
      [LifeAspect.Education]: 50,
      [LifeAspect.Health]: 20,
      [LifeAspect.Family]: 30,
      [LifeAspect.Growth]: 35,
      [LifeAspect.Career]: 40,
      [LifeAspect.Reputation]: 30,
      [LifeAspect.Spirituality]: 40,
      [LifeAspect.Luck]: 20
    }
  },
  {
    number: 44,
    planetName: PlanetName.Saturn,
    lifeAspects: {
      [LifeAspect.Finance]: 70,
      [LifeAspect.Romance]: 20,
      [LifeAspect.Education]: 40,
      [LifeAspect.Health]: 30,
      [LifeAspect.Family]: 40,
      [LifeAspect.Growth]: 50,
      [LifeAspect.Career]: 65,
      [LifeAspect.Reputation]: 45,
      [LifeAspect.Spirituality]: 40,
      [LifeAspect.Luck]: 35
    }
  },
  {
    number: 53,
    planetName: PlanetName.Saturn,
    lifeAspects: {
      [LifeAspect.Finance]: 60,
      [LifeAspect.Romance]: 40,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 55,
      [LifeAspect.Growth]: 65,
      [LifeAspect.Career]: 60,
      [LifeAspect.Reputation]: 65,
      [LifeAspect.Spirituality]: 60,
      [LifeAspect.Luck]: 55
    }
  },
  {
    number: 62,
    planetName: PlanetName.Saturn,
    lifeAspects: {
      [LifeAspect.Finance]: 70,
      [LifeAspect.Romance]: 50,
      [LifeAspect.Education]: 80,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 50,
      [LifeAspect.Growth]: 70,
      [LifeAspect.Career]: 75,
      [LifeAspect.Reputation]: 70,
      [LifeAspect.Spirituality]: 65,
      [LifeAspect.Luck]: 60
    }
  },
  {
    number: 71,
    planetName: PlanetName.Saturn,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 60,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 65,
      [LifeAspect.Growth]: 75,
      [LifeAspect.Career]: 70,
      [LifeAspect.Reputation]: 75,
      [LifeAspect.Spirituality]: 65,
      [LifeAspect.Luck]: 70
    }
  },
  {
    number: 80,
    planetName: PlanetName.Saturn,
    lifeAspects: {
      [LifeAspect.Finance]: 70,
      [LifeAspect.Romance]: 60,
      [LifeAspect.Education]: 80,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 65,
      [LifeAspect.Growth]: 70,
      [LifeAspect.Career]: 65,
      [LifeAspect.Reputation]: 70,
      [LifeAspect.Spirituality]: 85,
      [LifeAspect.Luck]: 65
    }
  },
  {
    number: 89,
    planetName: PlanetName.Saturn,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 70,
      [LifeAspect.Growth]: 75,
      [LifeAspect.Career]: 75,
      [LifeAspect.Reputation]: 80,
      [LifeAspect.Spirituality]: 65,
      [LifeAspect.Luck]: 70
    }
  },
  {
    number: 98,
    planetName: PlanetName.Saturn,
    lifeAspects: {
      [LifeAspect.Finance]: 50,
      [LifeAspect.Romance]: 40,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 30,
      [LifeAspect.Family]: 45,
      [LifeAspect.Growth]: 55,
      [LifeAspect.Career]: 50,
      [LifeAspect.Reputation]: 45,
      [LifeAspect.Spirituality]: 50,
      [LifeAspect.Luck]: 40
    }
  },
  {
    number: 107,
    planetName: PlanetName.Saturn,
    lifeAspects: {
      [LifeAspect.Finance]: 70,
      [LifeAspect.Romance]: 50,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 40,
      [LifeAspect.Family]: 55,
      [LifeAspect.Growth]: 65,
      [LifeAspect.Career]: 70,
      [LifeAspect.Reputation]: 75,
      [LifeAspect.Spirituality]: 60,
      [LifeAspect.Luck]: 55
    }
  },
  
  // MARS (9) numbers - 9, 18, 27, 36, 45, 54, 63, 72, 81, 90, 99, 108
  {
    number: 9,
    planetName: PlanetName.Mars,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 60,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 75,
      [LifeAspect.Growth]: 80,
      [LifeAspect.Career]: 75,
      [LifeAspect.Reputation]: 85,
      [LifeAspect.Spirituality]: 85,
      [LifeAspect.Luck]: 70
    }
  },
  {
    number: 18,
    planetName: PlanetName.Mars,
    lifeAspects: {
      [LifeAspect.Finance]: 20,
      [LifeAspect.Romance]: 10,
      [LifeAspect.Education]: 30,
      [LifeAspect.Health]: 20,
      [LifeAspect.Family]: 25,
      [LifeAspect.Growth]: 25,
      [LifeAspect.Career]: 20,
      [LifeAspect.Reputation]: 15,
      [LifeAspect.Spirituality]: 20,
      [LifeAspect.Luck]: 10
    }
  },
  {
    number: 27,
    planetName: PlanetName.Mars,
    lifeAspects: {
      [LifeAspect.Finance]: 90,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 80,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 75,
      [LifeAspect.Growth]: 85,
      [LifeAspect.Career]: 90,
      [LifeAspect.Reputation]: 90,
      [LifeAspect.Spirituality]: 80,
      [LifeAspect.Luck]: 85
    }
  },
  {
    number: 36,
    planetName: PlanetName.Mars,
    lifeAspects: {
      [LifeAspect.Finance]: 70,
      [LifeAspect.Romance]: 50,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 40,
      [LifeAspect.Family]: 50,
      [LifeAspect.Growth]: 65,
      [LifeAspect.Career]: 75,
      [LifeAspect.Reputation]: 65,
      [LifeAspect.Spirituality]: 55,
      [LifeAspect.Luck]: 60
    }
  },
  {
    number: 45,
    planetName: PlanetName.Mars,
    lifeAspects: {
      [LifeAspect.Finance]: 90,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 80,
      [LifeAspect.Family]: 75,
      [LifeAspect.Growth]: 85,
      [LifeAspect.Career]: 85,
      [LifeAspect.Reputation]: 80,
      [LifeAspect.Spirituality]: 65,
      [LifeAspect.Luck]: 85
    }
  },
  {
    number: 54,
    planetName: PlanetName.Mars,
    lifeAspects: {
      [LifeAspect.Finance]: 50,
      [LifeAspect.Romance]: 40,
      [LifeAspect.Education]: 60,
      [LifeAspect.Health]: 30,
      [LifeAspect.Family]: 45,
      [LifeAspect.Growth]: 55,
      [LifeAspect.Career]: 50,
      [LifeAspect.Reputation]: 55,
      [LifeAspect.Spirituality]: 45,
      [LifeAspect.Luck]: 40
    }
  },
  {
    number: 63,
    planetName: PlanetName.Mars,
    lifeAspects: {
      [LifeAspect.Finance]: 40,
      [LifeAspect.Romance]: 30,
      [LifeAspect.Education]: 20,
      [LifeAspect.Health]: 10,
      [LifeAspect.Family]: 30,
      [LifeAspect.Growth]: 25,
      [LifeAspect.Career]: 30,
      [LifeAspect.Reputation]: 25,
      [LifeAspect.Spirituality]: 20,
      [LifeAspect.Luck]: 15
    }
  },
  {
    number: 72,
    planetName: PlanetName.Mars,
    lifeAspects: {
      [LifeAspect.Finance]: 90,
      [LifeAspect.Romance]: 80,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 85,
      [LifeAspect.Growth]: 85,
      [LifeAspect.Career]: 90,
      [LifeAspect.Reputation]: 85,
      [LifeAspect.Spirituality]: 75,
      [LifeAspect.Luck]: 90
    }
  },
  {
    number: 81,
    planetName: PlanetName.Mars,
    lifeAspects: {
      [LifeAspect.Finance]: 80,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 80,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 70,
      [LifeAspect.Growth]: 75,
      [LifeAspect.Career]: 75,
      [LifeAspect.Reputation]: 80,
      [LifeAspect.Spirituality]: 70,
      [LifeAspect.Luck]: 75
    }
  },
  {
    number: 90,
    planetName: PlanetName.Mars,
    lifeAspects: {
      [LifeAspect.Finance]: 90,
      [LifeAspect.Romance]: 70,
      [LifeAspect.Education]: 50,
      [LifeAspect.Health]: 40,
      [LifeAspect.Family]: 65,
      [LifeAspect.Growth]: 80,
      [LifeAspect.Career]: 85,
      [LifeAspect.Reputation]: 80,
      [LifeAspect.Spirituality]: 45,
      [LifeAspect.Luck]: 80
    }
  },
  {
    number: 99,
    planetName: PlanetName.Mars,
    lifeAspects: {
      [LifeAspect.Finance]: 60,
      [LifeAspect.Romance]: 40,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 50,
      [LifeAspect.Family]: 55,
      [LifeAspect.Growth]: 60,
      [LifeAspect.Career]: 65,
      [LifeAspect.Reputation]: 60,
      [LifeAspect.Spirituality]: 65,
      [LifeAspect.Luck]: 50
    }
  },
  {
    number: 108,
    planetName: PlanetName.Mars,
    lifeAspects: {
      [LifeAspect.Finance]: 90,
      [LifeAspect.Romance]: 80,
      [LifeAspect.Education]: 70,
      [LifeAspect.Health]: 60,
      [LifeAspect.Family]: 80,
      [LifeAspect.Growth]: 85,
      [LifeAspect.Career]: 90,
      [LifeAspect.Reputation]: 85,
      [LifeAspect.Spirituality]: 80,
      [LifeAspect.Luck]: 90
    }
  }
];

// Now let's update the function to get a friendly title for each planet
export const getPlanetTitle = (planet: PlanetName): { en: string; vi: string } => {
  switch (planet) {
    case PlanetName.Sun:
      return { en: "The Leader", vi: "Người lãnh đạo" };
    case PlanetName.Moon:
      return { en: "The Nurturer", vi: "Người nhân ái" };
    case PlanetName.Jupiter:
      return { en: "The Communicator", vi: "Người biểu đạt" };
    case PlanetName.Rahu:
      return { en: "The North Node", vi: "Bắc Đẩu" };
    case PlanetName.Mercury:
      return { en: "The Free Spirit", vi: "Người tự do" };
    case PlanetName.Venus:
      return { en: "The Caregiver", vi: "Người chăm sóc" };
    case PlanetName.Ketu:
      return { en: "The Mystic", vi: "Người giải nghiệp" };
    case PlanetName.Saturn:
      return { en: "The Achiever", vi: "Người thành đạt" };
    case PlanetName.Mars:
      return { en: "The Warrior", vi: "Người chiến binh" };
    default:
      return { en: "Unknown", vi: "Không xác định" };
  }
};

// Get strengths and challenges based on planet
export const getPlanetTraits = (planet: PlanetName): { strengths: string[]; challenges: string[] } => {
  switch (planet) {
    case PlanetName.Sun:
      return {
        strengths: ["Independent", "Decisive", "Creative", "Confident", "Visionary"],
        challenges: ["Stubborn", "Domineering", "Selfish", "Impatient"]
      };
    case PlanetName.Moon:
      return {
        strengths: ["Cooperative", "Intuitive", "Diplomatic", "Patient", "Understanding"],
        challenges: ["Oversensitive", "Indecisive", "Dependent", "Worrisome"]
      };
    case PlanetName.Jupiter:
      return {
        strengths: ["Communicative", "Creative", "Optimistic", "Humorous", "Expressive"],
        challenges: ["Scattered", "Superficial", "Procrastinating", "Prideful"]
      };
    case PlanetName.Rahu:
      return {
        strengths: ["Stable", "Reliable", "Hardworking", "Practical", "Organized"],
        challenges: ["Needless fears", "Opposition", "Dependent", "Lack of confidence"]
      };
    case PlanetName.Mercury:
      return {
        strengths: ["Adaptable", "Flexible", "Curious", "Dynamic", "Versatile"],
        challenges: ["Restless", "Inconsistent", "Risk-taking", "Impulsive"]
      };
    case PlanetName.Venus:
      return {
        strengths: ["Loving", "Responsible", "Harmonious", "Supportive", "Understanding"],
        challenges: ["Self-sacrificing", "Worrisome", "Interfering", "Perfectionist"]
      };
    case PlanetName.Ketu:
      return {
        strengths: ["Analytical", "Intuitive", "Deep-thinking", "Spiritual", "Independent"],
        challenges: ["Skeptical", "Isolated", "Over-analytical", "Detached"]
      };
    case PlanetName.Saturn:
      return {
        strengths: ["Confident", "Managerial", "Practical", "Decisive", "Ambitious"],
        challenges: ["Domineering", "Materialistic", "Impatient", "Pressured"]
      };
    case PlanetName.Mars:
      return {
        strengths: ["Compassionate", "Generous", "Creative", "Idealistic", "Wise"],
        challenges: ["Unrealistic", "Self-sacrificing", "Emotionally intense", "Difficulty letting go"]
      };
    default:
      return {
        strengths: [],
        challenges: []
      };
  }
};
