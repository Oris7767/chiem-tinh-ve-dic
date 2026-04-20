// ============== CONSTANTS ==============

// RASHIS data (12 signs)
const RASHIS = {
  1: { name: 'Aries', nameVN: 'Bạch Dương', lord: 'Mars', symbol: '♈', varna: 'Kshatriya', vashya: ['Chatushpad'], element: 'Fire' },
  2: { name: 'Taurus', nameVN: 'Kim Ngưu', lord: 'Venus', symbol: '♉', varna: 'Vaishya', vashya: ['Dwipad'], element: 'Earth' },
  3: { name: 'Gemini', nameVN: 'Song Tử', lord: 'Mercury', symbol: '♊', varna: 'Shudra', vashya: ['Dwipad'], element: 'Air' },
  4: { name: 'Cancer', nameVN: 'Cự Giải', lord: 'Moon', symbol: '♋', varna: 'Shudra', vashya: ['Jalachar'], element: 'Water' },
  5: { name: 'Leo', nameVN: 'Sư Tử', lord: 'Sun', symbol: '♌', varna: 'Kshatriya', vashya: ['Vanchar'], element: 'Fire' },
  6: { name: 'Virgo', nameVN: 'Xử Nữ', lord: 'Mercury', symbol: '♍', varna: 'Shudra', vashya: ['Dwipad'], element: 'Earth' },
  7: { name: 'Libra', nameVN: 'Thiên Bình', lord: 'Venus', symbol: '♎', varna: 'Vaishya', vashya: ['Dwipad'], element: 'Air' },
  8: { name: 'Scorpio', nameVN: 'Thiên Yết', lord: 'Mars', symbol: '♏', varna: 'Kshatriya', vashya: ['Keet'], element: 'Water' },
  9: { name: 'Sagittarius', nameVN: 'Nhân Mã', lord: 'Jupiter', symbol: '♐', varna: 'Kshatriya', vashya: ['Chatushpad'], element: 'Fire' },
  10: { name: 'Capricorn', nameVN: 'Ma Kết', lord: 'Saturn', symbol: '♑', varna: 'Shudra', vashya: ['Chatushpad'], element: 'Earth' },
  11: { name: 'Aquarius', nameVN: 'Bảo Bình', lord: 'Saturn', symbol: '♒', varna: 'Shudra', vashya: ['Dwipad'], element: 'Air' },
  12: { name: 'Pisces', nameVN: 'Song Ngư', lord: 'Jupiter', symbol: '♓', varna: 'Shudra', vashya: ['Jalachar'], element: 'Water' }
};

// NAKSHATRAS data (27 nakshatras)
const NAKSHATRAS = {
  1: { name: 'Ashwini', lord: 'Ketu', gana: 'Deva', yoni: 'Ashwa', nadi: 'Vata', rulingPlanet: 'Ketu' },
  2: { name: 'Bharani', lord: 'Venus', gana: 'Yoni', yoni: 'Gaja', nadi: 'Vata', rulingPlanet: 'Venus' },
  3: { name: 'Krittika', lord: 'Sun', gana: 'Yoni', yoni: 'Mesh', nadi: 'Vata', rulingPlanet: 'Sun' },
  4: { name: 'Rohini', lord: 'Moon', gana: 'Yoni', yoni: 'Mahish', nadi: 'Vata', rulingPlanet: 'Moon' },
  5: { name: 'Mrigashira', lord: 'Mars', gana: 'Deva', yoni: 'Sarpa', nadi: 'Vata', rulingPlanet: 'Mars' },
  6: { name: 'Ardra', lord: 'Rahu', gana: 'Yoni', yoni: 'Vanar', nadi: 'Vata', rulingPlanet: 'Rahu' },
  7: { name: 'Punarvasu', lord: 'Jupiter', gana: 'Deva', yoni: 'Nakul', nadi: 'Pitta', rulingPlanet: 'Jupiter' },
  8: { name: 'Pushya', lord: 'Saturn', gana: 'Deva', yoni: 'Mushak', nadi: 'Pitta', rulingPlanet: 'Saturn' },
  9: { name: 'Ashlesha', lord: 'Mercury', gana: 'Yoni', yoni: 'Mesh', nadi: 'Pitta', rulingPlanet: 'Mercury' },
  10: { name: 'Magha', lord: 'Ketu', gana: 'Rakshasa', yoni: 'Mahish', nadi: 'Pitta', rulingPlanet: 'Ketu' },
  11: { name: 'Purva Phalguni', lord: 'Venus', gana: 'Manushya', yoni: 'Sarpa', nadi: 'Pitta', rulingPlanet: 'Venus' },
  12: { name: 'Uttara Phalguni', lord: 'Sun', gana: 'Manushya', yoni: 'Gaja', nadi: 'Pitta', rulingPlanet: 'Sun' },
  13: { name: 'Hasta', lord: 'Moon', gana: 'Manushya', yoni: 'Vanar', nadi: 'Kapha', rulingPlanet: 'Moon' },
  14: { name: 'Chitra', lord: 'Mars', gana: 'Rakshasa', yoni: 'Vyaghra', nadi: 'Kapha', rulingPlanet: 'Mars' },
  15: { name: 'Swati', lord: 'Rahu', gana: 'Deva', yoni: 'Nakul', nadi: 'Kapha', rulingPlanet: 'Rahu' },
  16: { name: 'Vishakha', lord: 'Jupiter', gana: 'Rakshasa', yoni: 'Vrisha', nadi: 'Kapha', rulingPlanet: 'Jupiter' },
  17: { name: 'Anuradha', lord: 'Saturn', gana: 'Deva', yoni: 'Mriga', nadi: 'Kapha', rulingPlanet: 'Saturn' },
  18: { name: 'Jyeshtha', lord: 'Mercury', gana: 'Rakshasa', yoni: 'Nakul', nadi: 'Kapha', rulingPlanet: 'Mercury' },
  19: { name: 'Mula', lord: 'Ketu', gana: 'Rakshasa', yoni: 'Shwan', nadi: 'Vata', rulingPlanet: 'Ketu' },
  20: { name: 'Purva Ashadha', lord: 'Venus', gana: 'Manushya', yoni: 'Singh', nadi: 'Vata', rulingPlanet: 'Venus' },
  21: { name: 'Uttara Ashadha', lord: 'Sun', gana: 'Manushya', yoni: 'Mushak', nadi: 'Vata', rulingPlanet: 'Sun' },
  22: { name: 'Shravana', lord: 'Moon', gana: 'Manushya', yoni: 'Vanar', nadi: 'Vata', rulingPlanet: 'Moon' },
  23: { name: 'Dhanishta', lord: 'Mars', gana: 'Rakshasa', yoni: 'Singh', nadi: 'Vata', rulingPlanet: 'Mars' },
  24: { name: 'Shatabhisha', lord: 'Rahu', gana: 'Rakshasa', yoni: 'Ashwa', nadi: 'Vata', rulingPlanet: 'Rahu' },
  25: { name: 'Purva Bhadrapada', lord: 'Jupiter', gana: 'Yoni', yoni: 'Singh', nadi: 'Vata', rulingPlanet: 'Jupiter' },
  26: { name: 'Uttara Bhadrapada', lord: 'Saturn', gana: 'Yoni', yoni: 'Mushak', nadi: 'Vata', rulingPlanet: 'Saturn' },
  27: { name: 'Revati', lord: 'Mercury', gana: 'Deva', yoni: 'Mushak', nadi: 'Vata', rulingPlanet: 'Mercury' }
};

// Planet relationship matrix (Vedic astrology standard)
const PLANETARY_RELATIONS = {
  Sun: { friends: ["Moon", "Mars", "Jupiter"], neutrals: ["Mercury"], enemies: ["Venus", "Saturn"] },
  Moon: { friends: ["Sun", "Mercury"], neutrals: ["Mars", "Jupiter", "Venus", "Saturn"], enemies: [] },
  Mars: { friends: ["Sun", "Moon", "Jupiter"], neutrals: ["Venus", "Saturn"], enemies: ["Mercury"] },
  Mercury: { friends: ["Sun", "Venus"], neutrals: ["Mars", "Jupiter", "Saturn"], enemies: ["Moon"] },
  Jupiter: { friends: ["Sun", "Moon", "Mars"], neutrals: ["Saturn"], enemies: ["Mercury", "Venus"] },
  Venus: { friends: ["Mercury", "Saturn"], neutrals: ["Mars", "Jupiter"], enemies: ["Sun", "Moon"] },
  Saturn: { friends: ["Mercury", "Venus"], neutrals: ["Jupiter"], enemies: ["Sun", "Moon", "Mars"] }
};

// Bitter enemies for Yoni (animal compatibility)
const BITTER_ENEMIES = [
  ['Ashwa', 'Mahish'], ['Gaja', 'Singh'], ['Mesh', 'Vanar'],
  ['Sarpa', 'Nakul'], ['Shwan', 'Mriga'], ['Marjara', 'Mushak'], ['Vyaghra', 'Gau']
];

/**
 * Check single-direction relationship between two planets
 */
const getSingleRelation = (planetA, planetB) => {
  if (planetA === planetB) return 'Same';
  if (PLANETARY_RELATIONS[planetA]?.friends?.includes(planetB)) return 'Friend';
  if (PLANETARY_RELATIONS[planetA]?.enemies?.includes(planetB)) return 'Enemy';
  return 'Neutral';
};

/**
 * Check the relationship between two planets (legacy function for backward compatibility)
 */
const checkRelation = (planetA, planetB) => {
  if (!planetA || !planetB) return 'Neutral';
  return getSingleRelation(planetA, planetB);
};

// Varna hierarchy (higher rank = better)
const VARNA_RANK = {
  Brahmin: 4,
  Kshatriya: 3,
  Vaishya: 2,
  Shudra: 1
};

// Yoni relations will be calculated dynamically using BITTER_ENEMIES


// ============== HELPER FUNCTIONS ==============

const areLordsFriendly = (lordA, lordB) => {
  if (lordA === lordB) return true;
  const relA = getSingleRelation(lordA, lordB);
  const relB = getSingleRelation(lordB, lordA);
  // If both see each other as friends, or one is friend + other is neutral, it's considered harmonious
  return (relA === 'Friend' && relB === 'Friend') ||
         (relA === 'Friend' && relB === 'Neutral') ||
         (relA === 'Neutral' && relB === 'Friend');
};

const calculateTaraBase = (boyNakshatra, girlNakshatra) => {
  let distance = (girlNakshatra - boyNakshatra + 27) % 27;
  if (distance === 0) distance = 27;
  
  const remainder = distance % 9;
  let score1 = [3, 5, 7].includes(remainder) ? 0 : 1.5;
  
  let distance2 = (boyNakshatra - girlNakshatra + 27) % 27;
  if (distance2 === 0) distance2 = 27;
  
  const remainder2 = distance2 % 9;
  let score2 = [3, 5, 7].includes(remainder2) ? 0 : 1.5;
  
  return {
    score: score1 + score2,
    direction1Score: score1,
    direction2Score: score2,
    distance1: distance,
    remainder1: remainder,
    distance2: distance2,
    remainder2: remainder2
  };
};

const getYoniScore = (boyYoni, girlYoni) => {
  if (boyYoni === girlYoni) return 4;

  // Check if bitter enemies (check both directions)
  const isBitterEnemy = BITTER_ENEMIES.some(pair =>
    (pair[0] === boyYoni && pair[1] === girlYoni) ||
    (pair[1] === boyYoni && pair[0] === girlYoni)
  );

  if (isBitterEnemy) return 0;

  // Other relations default to 2 points (can be upgraded with full matrix later)
  return 2;
};

// ============== KOOTA CALCULATORS WITH PARIHAR ==============

const calculateVarnaKoota = (boyMoon, girlMoon) => {
  const boyVarna = RASHIS[boyMoon.rashi].varna;
  const girlVarna = RASHIS[girlMoon.rashi].varna;
  const boyLord = RASHIS[boyMoon.rashi].lord;
  const girlLord = RASHIS[girlMoon.rashi].lord;
  
  const boyRank = VARNA_RANK[boyVarna] || 0;
  const girlRank = VARNA_RANK[girlVarna] || 0;
  let baseScore = boyRank >= girlRank ? 1 : 0;
  let baseDescription = boyRank >= girlRank 
    ? `Boy's ${boyVarna} >= Girl's ${girlVarna}` 
    : `Boy's ${boyVarna} < Girl's ${girlVarna}`;
  
  let finalScore = baseScore;
  let pariharActive = false;
  let pariharReason = '';
  
  if (areLordsFriendly(boyLord, girlLord)) {
    finalScore = 1;
    pariharActive = true;
    pariharReason = 'Rashi Lords are same/friends';
  }
  
  return {
    name: 'Varna Koota',
    maxPoints: 1,
    baseScore,
    points: finalScore,
    description: baseDescription,
    parihar: pariharActive ? { active: true, reason: pariharReason, overridden: baseScore !== finalScore } : null,
    dosha: null
  };
};

const calculateVashyaKoota = (boyMoon, girlMoon, yoniScore) => {
  const boyVashya = RASHIS[boyMoon.rashi].vashya[0];
  const girlVashya = RASHIS[girlMoon.rashi].vashya[0];
  const boyLord = RASHIS[boyMoon.rashi].lord;
  const girlLord = RASHIS[girlMoon.rashi].lord;
  
  let baseScore = 0;
  let baseDescription = '';
  
  if (boyVashya === girlVashya) {
    baseScore = 2;
    baseDescription = `Same Vashya: ${boyVashya}`;
  } else {
    const controlPairs = {
      'Dwipad': ['Chatushpad'],
      'Chatushpad': ['Keet', 'Jalachar'],
    };
    
    if (controlPairs[boyVashya]?.includes(girlVashya)) {
      baseScore = 1;
      baseDescription = `Boy's ${boyVashya} controls girl's ${girlVashya}`;
    } else if (controlPairs[girlVashya]?.includes(boyVashya)) {
      baseScore = 0.5;
      baseDescription = `Girl's ${girlVashya} controls boy's ${boyVashya}`;
    } else {
      baseScore = 0;
      baseDescription = `No relation: ${boyVashya} vs ${girlVashya}`;
    }
  }
  
  let finalScore = baseScore;
  let pariharActive = false;
  let pariharReason = '';
  
  if (baseScore < 1) {
    if (areLordsFriendly(boyLord, girlLord) || yoniScore === 4) {
      finalScore = 1;
      pariharActive = true;
      pariharReason = areLordsFriendly(boyLord, girlLord) 
        ? 'Rashi Lords are same/friends' 
        : 'Yoni score is maximum';
    }
  }
  
  return {
    name: 'Vashya Koota',
    maxPoints: 2,
    baseScore,
    points: finalScore,
    description: baseDescription,
    parihar: pariharActive ? { active: true, reason: pariharReason, overridden: baseScore !== finalScore } : null,
    dosha: null
  };
};

const calculateTaraKoota = (boyMoon, girlMoon) => {
  const boyNakshatra = boyMoon.nakshatra;
  const girlNakshatra = girlMoon.nakshatra;
  const boyLord = RASHIS[boyMoon.rashi].lord;
  const girlLord = RASHIS[girlMoon.rashi].lord;
  
  const taraResult = calculateTaraBase(boyNakshatra, girlNakshatra);
  
  let baseScore = taraResult.score;
  let baseDescription = `Boy→Girl: dist=${taraResult.distance1}, rem=${taraResult.remainder1}, score=${taraResult.direction1Score}; Girl→Boy: dist=${taraResult.distance2}, rem=${taraResult.remainder2}, score=${taraResult.direction2Score}`;
  
  let finalScore = baseScore;
  let pariharActive = false;
  let pariharReason = '';
  
  if (areLordsFriendly(boyLord, girlLord)) {
    finalScore = 3;
    pariharActive = true;
    pariharReason = 'Rashi Lords are same/friends';
  }
  
  return {
    name: 'Tara Koota',
    maxPoints: 3,
    baseScore,
    points: finalScore,
    description: baseDescription,
    parihar: pariharActive ? { active: true, reason: pariharReason, overridden: baseScore !== finalScore } : null,
    dosha: null
  };
};

const calculateYoniKoota = (boyMoon, girlMoon, bhakootScore) => {
  const boyYoni = NAKSHATRAS[boyMoon.nakshatra].yoni;
  const girlYoni = NAKSHATRAS[girlMoon.nakshatra].yoni;
  const boyLord = RASHIS[boyMoon.rashi].lord;
  const girlLord = RASHIS[girlMoon.rashi].lord;
  
  const baseScore = getYoniScore(boyYoni, girlYoni);
  let baseDescription = `${boyYoni} vs ${girlYoni}`;
  
  let finalScore = baseScore;
  let pariharActive = false;
  let pariharReason = '';
  
  if (baseScore < 2) {
    if (areLordsFriendly(boyLord, girlLord) || bhakootScore === 7) {
      finalScore = 2;
      pariharActive = true;
      pariharReason = areLordsFriendly(boyLord, girlLord) 
        ? 'Rashi Lords are same/friends' 
        : 'Bhakoot score is maximum';
    }
  }
  
  return {
    name: 'Yoni Koota',
    maxPoints: 4,
    baseScore,
    points: finalScore,
    description: baseDescription,
    parihar: pariharActive ? { active: true, reason: pariharReason, overridden: baseScore !== finalScore } : null,
    dosha: null
  };
};

const calculateGrahaMaitriKoota = (boyMoon, girlMoon, bhakootScore) => {
  const boyLord = RASHIS[boyMoon.rashi].lord;
  const girlLord = RASHIS[girlMoon.rashi].lord;
  const relA = getSingleRelation(boyLord, girlLord);
  const relB = getSingleRelation(girlLord, boyLord);

  let baseScore = 0;
  let baseDescription = '';

  if (relA === 'Same') {
    baseScore = 5;
    baseDescription = `Lords are Same: ${boyLord} & ${girlLord}`;
  } else if (relA === 'Friend' && relB === 'Friend') {
    baseScore = 5;
    baseDescription = `Lords are mutual Friends: ${boyLord} & ${girlLord}`;
  } else if ((relA === 'Friend' && relB === 'Neutral') || (relA === 'Neutral' && relB === 'Friend')) {
    baseScore = 4;
    baseDescription = `Lords are Friend+Neutral: ${boyLord} & ${girlLord} (${relA}/${relB})`;
  } else if (relA === 'Neutral' && relB === 'Neutral') {
    baseScore = 3;
    baseDescription = `Lords are neutral: ${boyLord} & ${girlLord}`;
  } else if ((relA === 'Enemy' && relB === 'Neutral') || (relA === 'Neutral' && relB === 'Enemy')) {
    baseScore = 1;
    baseDescription = `Lords are Neutral+Enemy: ${boyLord} & ${girlLord} (${relA}/${relB})`;
  } else {
    baseScore = 0.5;
    baseDescription = `Lords are Enemies: ${boyLord} & ${girlLord}`;
  }

  let finalScore = baseScore;
  let pariharActive = false;
  let pariharReason = '';

  if (baseScore < 3) {
    const sameNakshatraDifferentRashi = boyMoon.nakshatra === girlMoon.nakshatra && boyMoon.rashi !== girlMoon.rashi;

    if (bhakootScore === 7 || sameNakshatraDifferentRashi) {
      finalScore = 3;
      pariharActive = true;
      pariharReason = bhakootScore === 7
        ? 'Bhakoot score is maximum'
        : 'Same Nakshatra but different Rashi';
    }
  }

  return {
    name: 'Graha Maitri Koota',
    maxPoints: 5,
    baseScore,
    points: finalScore,
    description: baseDescription,
    parihar: pariharActive ? { active: true, reason: pariharReason, overridden: baseScore !== finalScore } : null,
    dosha: null
  };
};

const calculateGanaKoota = (boyMoon, girlMoon, bhakootScore) => {
  const boyGana = NAKSHATRAS[boyMoon.nakshatra].gana;
  const girlGana = NAKSHATRAS[girlMoon.nakshatra].gana;
  const boyLord = RASHIS[boyMoon.rashi].lord;
  const girlLord = RASHIS[girlMoon.rashi].lord;
  
  let baseScore = 0;
  let baseDescription = '';
  
  if (boyGana === girlGana) {
    baseScore = 6;
    baseDescription = `Same Gana: ${boyGana}`;
  } else if (boyGana === 'Deva' && girlGana === 'Manushya') {
    baseScore = 6;
    baseDescription = 'Boy Deva + Girl Manushya';
  } else if (boyGana === 'Manushya' && girlGana === 'Deva') {
    baseScore = 5;
    baseDescription = 'Boy Manushya + Girl Deva';
  } else if (boyGana === 'Rakshasa' && girlGana === 'Deva') {
    baseScore = 1;
    baseDescription = 'Boy Rakshasa + Girl Deva';
  } else if (boyGana === 'Deva' && girlGana === 'Rakshasa') {
    baseScore = 0;
    baseDescription = 'Boy Deva + Girl Rakshasa';
  } else {
    baseScore = 0;
    baseDescription = `${boyGana} + ${girlGana}`;
  }
  
  let finalScore = baseScore;
  let pariharActive = false;
  let pariharReason = '';
  
  if (baseScore < 5) {
    if (areLordsFriendly(boyLord, girlLord) || bhakootScore === 7) {
      finalScore = 5;
      pariharActive = true;
      pariharReason = areLordsFriendly(boyLord, girlLord) 
        ? 'Rashi Lords are same/friends' 
        : 'Bhakoot score is maximum';
    }
  }
  
  return {
    name: 'Gana Koota',
    maxPoints: 6,
    baseScore,
    points: finalScore,
    description: baseDescription,
    parihar: pariharActive ? { active: true, reason: pariharReason, overridden: baseScore !== finalScore } : null,
    dosha: null
  };
};

const calculateBhakootKoota = (boyMoon, girlMoon) => {
  const boyRashi = boyMoon.rashi;
  const girlRashi = girlMoon.rashi;
  const boyLord = RASHIS[boyRashi].lord;
  const girlLord = RASHIS[girlRashi].lord;

  // Calculate distance between 2 signs (one direction is enough to determine axis)
  let distance = (girlRashi - boyRashi + 12) % 12;
  if (distance === 0) distance = 12; // Same sign = axis 1/1

  // Check if it falls into bad axes: 2/12, 5/9, 6/8
  const isBadAxis = [2, 12, 5, 9, 6, 8].includes(distance);

  let baseScore = isBadAxis ? 0 : 7;
  const axisName = isBadAxis
    ? (distance === 2 || distance === 12 ? '2/12' : distance === 5 || distance === 9 ? '5/9' : '6/8')
    : 'Tốt';

  const baseDescription = `Trục ${axisName}: Boy ở ${RASHIS[boyRashi].nameVN}, Girl ở ${RASHIS[girlRashi].nameVN}`;

  let finalScore = baseScore;
  let pariharActive = false;
  let pariharReason = '';

  // Parihar rule
  if (areLordsFriendly(boyLord, girlLord)) {
    finalScore = 7;
    pariharActive = true;
    pariharReason = 'Chủ tinh 2 cung là Bạn bè/Giống nhau';
  }

  return {
    name: 'Bhakoot Koota',
    maxPoints: 7,
    baseScore,
    points: finalScore,
    description: baseDescription,
    parihar: pariharActive ? { active: true, reason: pariharReason, overridden: baseScore !== finalScore } : null,
    dosha: baseScore === 0 && !pariharActive ? { type: 'Bhakoot Dosha', severity: 'High', description: 'Trục cung xấu gây hao tài hoặc bất đồng' } : null
  };
};

const calculateNadiKoota = (boyMoon, girlMoon) => {
  const boyNadi = NAKSHATRAS[boyMoon.nakshatra].nadi;
  const girlNadi = NAKSHATRAS[girlMoon.nakshatra].nadi;
  const boyLord = RASHIS[boyMoon.rashi].lord;
  const girlLord = RASHIS[girlMoon.rashi].lord;
  
  const hasDosha = boyNadi === girlNadi;
  let baseScore = hasDosha ? 0 : 8;
  let baseDescription = hasDosha 
    ? `Same Nadi: ${boyNadi} - NADI DOSHA` 
    : `Different Nadi: ${boyNadi} vs ${girlNadi}`;
  
  let finalScore = baseScore;
  let pariharActive = false;
  let pariharReason = '';
  let doshaCancelled = false;
  
  if (hasDosha) {
    const conditions = [];
    let pariHarsatisfied = false;
    
    if (areLordsFriendly(boyLord, girlLord)) {
      conditions.push('Rashi Lords are same/friends');
      pariHarsatisfied = true;
    }
    if (boyMoon.nakshatra !== girlMoon.nakshatra && boyMoon.rashi === girlMoon.rashi) {
      conditions.push('Different Nakshatra but Same Rashi');
      pariHarsatisfied = true;
    }
    if (boyMoon.nakshatra === girlMoon.nakshatra && boyMoon.rashi !== girlMoon.rashi) {
      conditions.push('Same Nakshatra but Different Rashi');
      pariHarsatisfied = true;
    }
    if (boyMoon.nakshatra === girlMoon.nakshatra && 
        boyMoon.rashi === girlMoon.rashi && 
        boyMoon.pada !== girlMoon.pada) {
      conditions.push('Same Nakshatra & Rashi but Different Charan');
      pariHarsatisfied = true;
    }
    
    if (pariHarsatisfied) {
      finalScore = 8;
      pariharActive = true;
      pariharReason = conditions.join(', ');
      doshaCancelled = true;
    }
  }
  
  return {
    name: 'Nadi Koota',
    maxPoints: 8,
    baseScore,
    points: finalScore,
    description: baseDescription,
    parihar: pariharActive ? { active: true, reason: pariharReason, overridden: baseScore !== finalScore } : null,
    dosha: hasDosha && !doshaCancelled ? {
      type: 'Nadi Dosha',
      severity: 'Severe',
      description: 'Both have same Nadi - can cause health and progeny issues'
    } : null
  };
};

// ============== MAIN FUNCTION ==============

export const calculateAshtakoota = (boyMoon, girlMoon) => {
  if (!boyMoon?.rashi || !girlMoon?.rashi) {
    throw new Error('Invalid Moon positions. rashi is required.');
  }

  if (boyMoon.rashi < 1 || boyMoon.rashi > 12 || girlMoon.rashi < 1 || girlMoon.rashi > 12) {
    throw new Error('Rashi must be between 1 and 12');
  }

  if (boyMoon.nakshatra < 1 || boyMoon.nakshatra > 27 || girlMoon.nakshatra < 1 || girlMoon.nakshatra > 27) {
    throw new Error('Nakshatra must be between 1 and 27');
  }

  const boy = { ...boyMoon, pada: boyMoon.pada || 1 };
  const girl = { ...girlMoon, pada: girlMoon.pada || 1 };

  const bhakootResult = calculateBhakootKoota(boy, girl);
  const bhakootScore = bhakootResult.points;
  
  const yoniResult = calculateYoniKoota(boy, girl, bhakootScore);
  const yoniScore = yoniResult.points;

  const kootaResults = [
    calculateVarnaKoota(boy, girl),
    calculateVashyaKoota(boy, girl, yoniScore),
    calculateTaraKoota(boy, girl),
    yoniResult,
    calculateGrahaMaitriKoota(boy, girl, bhakootScore),
    calculateGanaKoota(boy, girl, bhakootScore),
    bhakootResult,
    calculateNadiKoota(boy, girl)
  ];

  const totalPoints = kootaResults.reduce((sum, koota) => sum + koota.points, 0);
  const maxPoints = kootaResults.reduce((sum, koota) => sum + koota.maxPoints, 0);
  const totalBaseScore = kootaResults.reduce((sum, koota) => sum + koota.baseScore, 0);
  const percentage = Math.round((totalPoints / maxPoints) * 100);

  const doshas = kootaResults
    .filter(koota => koota.dosha)
    .map(koota => ({ koota: koota.name, ...koota.dosha }));

  const parihars = kootaResults
    .filter(koota => koota.parihar?.active)
    .map(koota => ({ koota: koota.name, ...koota.parihar }));

  let compatibilityLevel = '';
  let compatibilityDescription = '';

  if (percentage >= 75 && doshas.length === 0) {
    compatibilityLevel = 'Excellent';
    compatibilityDescription = 'Perfect match. Highly recommended for marriage.';
  } else if (percentage >= 65 && doshas.length <= 1) {
    compatibilityLevel = 'Good';
    compatibilityDescription = 'Good match. Can proceed with marriage.';
  } else if (percentage >= 50) {
    compatibilityLevel = 'Moderate';
    compatibilityDescription = 'Average match. Some doshas present. Remedial measures recommended.';
  } else {
    compatibilityLevel = 'Poor';
    compatibilityDescription = 'Poor match. Multiple doshas present. Marriage not recommended without extensive remedies.';
  }

  return {
    totalPoints,
    maxPoints,
    percentage,
    totalBaseScore,
    compatibilityLevel,
    compatibilityDescription,
    kootaBreakdown: kootaResults,
    doshas,
    hasDoshas: doshas.length > 0,
    totalDoshas: doshas.length,
    parihars,
    hasParihar: parihars.length > 0,
    totalParihars: parihars.length,
    boyDetails: {
      rashi: RASHIS[boy.rashi],
      nakshatra: NAKSHATRAS[boy.nakshatra],
      rashiNum: boy.rashi,
      nakshatraNum: boy.nakshatra,
      pada: boy.pada
    },
    girlDetails: {
      rashi: RASHIS[girl.rashi],
      nakshatra: NAKSHATRAS[girl.nakshatra],
      rashiNum: girl.rashi,
      nakshatraNum: girl.nakshatra,
      pada: girl.pada
    },
    recommendations: generateRecommendations(kootaResults, doshas, parihars)
  };
};

const generateRecommendations = (kootaResults, doshas, parihars) => {
  const recommendations = [];

  const nadiDosha = doshas.find(d => d.type === 'Nadi Dosha');
  if (nadiDosha) {
    recommendations.push({
      priority: 'Critical',
      title: 'Nadi Dosha Present',
      description: 'This is considered the most serious dosha in compatibility. Can cause health and progeny issues.',
      remedy: 'Consult a qualified astrologer for specific remedies such as Nadi gemstone, mantra, or ritual.'
    });
  }

  if (parihars.length > 0) {
    recommendations.push({
      priority: 'Info',
      title: 'Dosha Cancellations Applied',
      description: `${parihars.length} dosha(s) have been cancelled through Parihar rules.`,
      details: parihars.map(p => `- ${p.koota}: ${p.reason}`).join('\n')
    });
  }

  if (doshas.length === 0) {
    recommendations.push({
      priority: 'Positive',
      title: 'No Critical Doshas',
      description: 'No major doshas detected. The match is astrologically favorable.',
      remedy: null
    });
  }

  return recommendations;
};

export const getQuickScore = (boyMoon, girlMoon) => {
  const result = calculateAshtakoota(boyMoon, girlMoon);
  return {
    percentage: result.percentage,
    level: result.compatibilityLevel,
    hasDoshas: result.hasDoshas
  };
};

export const isMarriageRecommended = (boyMoon, girlMoon) => {
  const result = calculateAshtakoota(boyMoon, girlMoon);

  const nadiDosha = result.doshas.find(d => d.type === 'Nadi Dosha');
  if (nadiDosha) {
    return { recommended: false, reason: 'Nadi Dosha is present and not cancelled' };
  }

  if (result.doshas.length > 2) {
    return { recommended: false, reason: `${result.doshas.length} doshas present` };
  }

  if (result.percentage < 50) {
    return { recommended: false, reason: 'Compatibility score below 50%' };
  }

  return { recommended: true, reason: 'Compatibility is acceptable' };
};

export default calculateAshtakoota;

// ============== MOON POSITION EXTRACTION ==============

const NAKSHATRA_NAME_MAP = {
  'Ashwini': 1, 'Bharani': 2, 'Krittika': 3, 'Rohini': 4, 'Mrigashira': 5, 'Ardra': 6,
  'Punarvasu': 7, 'Pushya': 8, 'Ashlesha': 9, 'Magha': 10, 'Purva Phalguni': 11,
  'Uttara Phalguni': 12, 'Hasta': 13, 'Chitra': 14, 'Swati': 15, 'Vishakha': 16,
  'Anuradha': 17, 'Jyeshtha': 18, 'Mool': 19, 'Mula': 19, 'Purva Ashadha': 20,
  'Uttara Ashadha': 21, 'Shravana': 22, 'Dhanishta': 23, 'Shatabhisha': 24,
  'Shatabhishak': 24, 'Purva Bhadrapada': 25, 'Uttara Bhadrapada': 26, 'Revati': 27
};

const RASHI_NAME_MAP = {
  'Aries': 1, 'Mesh': 1, 'Taurus': 2, 'Vrish': 2, 'Gemini': 3, 'Mithun': 3,
  'Cancer': 4, 'Karka': 4, 'Leo': 5, 'Singh': 5, 'Virgo': 6, 'Kanya': 6,
  'Libra': 7, 'Tula': 7, 'Scorpio': 8, 'Vrishchik': 8, 'Sagittarius': 9, 'Dhanu': 9,
  'Capricorn': 10, 'Makar': 10, 'Aquarius': 11, 'Kumbh': 11, 'Pisces': 12, 'Meena': 12
};

export const extractMoonPosition = (chartData) => {
  if (!chartData || !chartData.planets) {
    throw new Error('Invalid chart data: planets array is required');
  }

  const moon = chartData.planets.find(p => 
    p.id === 'mo' || p.name === 'Moon' || p.name === 'MOON'
  );

  if (!moon) {
    throw new Error('Moon not found in chart data');
  }

  let rashi = moon.sign;
  if (typeof moon.sign === 'string') {
    rashi = RASHI_NAME_MAP[moon.sign] || parseInt(moon.sign);
  }
  if (typeof rashi !== 'number' || rashi < 1 || rashi > 12) {
    const longitude = moon.longitude || 0;
    rashi = Math.floor(longitude / 30) + 1;
    if (rashi > 12) rashi = rashi - 12;
  }

  let nakshatra = 1;
  let nakshatraName = '';

  if (moon.nakshatra && typeof moon.nakshatra === 'object') {
    nakshatraName = moon.nakshatra.name || '';
    if (NAKSHATRA_NAME_MAP[nakshatraName]) {
      nakshatra = NAKSHATRA_NAME_MAP[nakshatraName];
    }
  } else if (moon.nakshatra && typeof moon.nakshatra === 'string') {
    nakshatraName = moon.nakshatra;
    nakshatra = NAKSHATRA_NAME_MAP[nakshatraName] || 1;
  }

  if (nakshatra === 1 && nakshatraName === '' && chartData.moonNakshatra) {
    nakshatraName = chartData.moonNakshatra;
    nakshatra = NAKSHATRA_NAME_MAP[nakshatraName] || 1;
  }

  let pada = 1;
  if (moon.nakshatra && typeof moon.nakshatra === 'object') {
    if (moon.nakshatra.pada) {
      pada = moon.nakshatra.pada;
    } else {
      const degreeInNakshatra = (moon.longitude % 30) % 13.333;
      pada = Math.floor(degreeInNakshatra / 3.333) + 1;
      if (pada > 4) pada = 4;
    }
  }

  return {
    rashi: Number(rashi),
    nakshatra: Number(nakshatra),
    pada: Number(pada),
    rashiName: RASHIS[rashi]?.name || 'Unknown',
    nakshatraName: NAKSHATRAS[nakshatra]?.name || 'Unknown',
    degree: moon.longitude % 30
  };
};

export const extractMoonFromApiResponse = (apiData) => {
  if (!apiData || !apiData.planets) {
    throw new Error('Invalid API response: planets array is required');
  }

  const moonPlanet = apiData.planets.find(p => 
    p.planet === 'Moon' || p.planet === 'MOON' || p.planet === 'moon'
  );

  if (!moonPlanet) {
    throw new Error('Moon not found in API response');
  }

  let rashi = moonPlanet.sign?.name ? RASHI_NAME_MAP[moonPlanet.sign.name] : moonPlanet.sign;
  if (typeof rashi !== 'number') rashi = 1;

  let nakshatra = NAKSHATRA_NAME_MAP[moonPlanet.nakshatra?.name] || 1;
  let pada = moonPlanet.nakshatra?.pada || 1;

  return {
    rashi: Number(rashi),
    nakshatra: Number(nakshatra),
    pada: Number(pada),
    rashiName: RASHIS[rashi]?.name || 'Unknown',
    nakshatraName: NAKSHATRAS[nakshatra]?.name || 'Unknown',
    degree: moonPlanet.longitude % 30
  };
};
