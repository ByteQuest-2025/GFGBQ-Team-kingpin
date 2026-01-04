// src/utils/selectionLogic.js

// 1. SPECIALTY MAPPING
const SPECIALTY_MAP = {
  'Head Injury': 'Neurologist',
  'Heart Attack': 'Cardiologist',
  'Fracture': 'Orthopedic',
  'Burns': 'Plastic Surgeon',
  'General Trauma': 'General Surgeon'
};

// 2. SIMULATION UTILS
// We generate these randomly to simulate "Searching" in real-time
const getHospitalSpecialties = () => {
  const all = ['Neurologist', 'Cardiologist', 'Orthopedic', 'Plastic Surgeon', 'General Surgeon'];
  return all.sort(() => 0.5 - Math.random()).slice(0, 3);
};

export const findBestHospital = (hospitals, severity, injuryType) => {
  const requiredDoctor = SPECIALTY_MAP[injuryType] || 'General Surgeon';
  console.log(`Running Formula for: ${severity}, Need: ${requiredDoctor}`);

  // 3. PREPARE DATA WITH RANDOM NOISE (Simulating Real-Time Changes)
  const scoredHospitals = hospitals.map(h => {
    // A. Simulate Dynamic Location (Spread around Chennai)
    const latOffset = (Math.random() - 0.5) * 0.1; 
    const lngOffset = (Math.random() - 0.5) * 0.1;
    const lat = 13.0827 + latOffset;
    const lng = 80.2707 + lngOffset;

    // B. Simulate Dynamic Traffic/Distance
    const distance = Math.floor(Math.random() * 15) + 2; // 2km to 17km
    const trafficFactor = Math.random() * 0.5 + 1; // 1.0 to 1.5 multiplier
    const travelTime = Math.floor(distance * 2 * trafficFactor); // T (in minutes)

    // C. Simulate Resources
    const specialties = getHospitalSpecialties();
    const hasSpecialist = specialties.includes(requiredDoctor) ? 1 : 0; // M
    const availableBeds = Math.max(0, h.availableBeds + Math.floor(Math.random() * 5) - 2); // B (Fluctuate slightly)

    return {
      ...h,
      lat,
      lng,
      distance,
      travelTime, // T
      hasSpecialist, // M
      availableBeds, // B
      score: 0
    };
  });

  // 4. APPLY THE FORMULA
  scoredHospitals.forEach(h => {
    // --- VARIABLES ---
    const B = h.availableBeds;
    const M = h.hasSpecialist;
    const T = Math.max(1, h.travelTime); // Avoid divide by zero

    // --- WEIGHTS (Calibrated for balance) ---
    const Wb = 2.0;  // Bed importance
    const Wm = 50.0; // Specialist importance (Very High)
    const Wt = 1.0;  // Time importance

    // --- MULTIPLIERS ---
    // Cp: Criticality Multiplier
    let Cp = 1.0;
    if (severity === 'Very Severe' || severity === 'Severe') Cp = 0.5; // Lower denominator = Higher Score (Urgency)
    if (severity === 'Moderate') Cp = 1.0;
    if (severity === 'Minor') Cp = 2.0; // Higher denominator = Lower Score (Can wait)

    // Tp: Threshold Penalty
    // If beds are low (<5) and patient is minor, penalize heavily
    let Tp = 1.0;
    if (B < 5 && severity === 'Minor') Tp = 0.2;

    // --- CALCULATION ---
    // Formula: Hs = ((B * Wb * Tp) + (M * Wm)) / (T * (Wt * Cp))
    const numerator = (B * Wb * Tp) + (M * Wm);
    const denominator = T * (Wt * Cp);
    
    h.score = numerator / denominator;
  });

  // 5. SORT: Highest Score is Best
  scoredHospitals.sort((a, b) => b.score - a.score);

  // Return the full list (for the map) and the winner
  return {
    best: scoredHospitals[0],
    all: scoredHospitals
  };
};