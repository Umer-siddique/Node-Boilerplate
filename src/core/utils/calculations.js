// src/utils/calculations.js
const { ObjectId } = require("mongodb");

function calculateRatifiedInstruments(instruments, countryId) {
  let ratifiedCount = 0;
  let totalInstruments = instruments.length;

  instruments.forEach((instrument) => {
    const ratification = instrument.countryRatifications.find((rat) =>
      rat.countryName.equals(new ObjectId(countryId))
    );

    if (ratification) {
      const lastRatification =
        ratification.ratifications[ratification.ratifications.length - 1];
      if (lastRatification.ratified) {
        ratifiedCount++;
      }
    }
  });

  const ratificationPercent = (ratifiedCount / totalInstruments) * 100;

  return ratificationPercent !== 0
    ? `${ratifiedCount}/${totalInstruments} (${ratificationPercent.toFixed(
        2
      )}%)`
    : `${ratifiedCount}/${totalInstruments}`;
}

function calculateCountryScore(instruments, countryId) {
  let totalRelevance = 0;
  let ratifiedRelevance = 0;

  instruments.forEach((instrument) => {
    const ratification = instrument.countryRatifications.find((rat) =>
      rat.countryName.equals(new ObjectId(countryId))
    );

    if (ratification) {
      const lastRatification =
        ratification.ratifications[ratification.ratifications.length - 1];
      if (lastRatification.ratified) {
        ratifiedRelevance += instrument.relevance;
      }
    }
    totalRelevance += instrument.relevance;
  });

  return ((ratifiedRelevance / totalRelevance) * 100).toFixed(2) + "%";
}

function calculateWorldAvgScore(countries, instruments, subCategory) {
  if (!countries || countries.length === 0) return "0%"; // Prevent division by zero

  const totalCountries = countries.length;
  let sumCountryScores = 0;

  for (const country of countries) {
    const countryId = country._id;
    let countryScore = calculateCountryScore(instruments, countryId); // Ensure this function returns a number

    // Ensure countryScore is a valid number
    const scoreValue = parseFloat(countryScore);
    if (!isNaN(scoreValue)) {
      sumCountryScores += scoreValue;
    }
  }

  // Calculate World Average Score
  const worldAvgScore = (sumCountryScores / totalCountries).toFixed(2) + "%";

  return worldAvgScore;
}

function calculateCountryRank(countries, instruments, subCategory, countryId) {
  // Calculate scores for all countries in the subcategory
  const countryScores = [];

  for (const country of countries) {
    const countryScore = calculateCountryScore(instruments, country._id);

    // Convert the countryScore (e.g., "14.29%") to a number
    const scoreValue = parseFloat(countryScore.replace("%", ""));

    countryScores.push({
      countryId: country._id,
      score: scoreValue,
    });
  }

  // Sort scores in descending order
  countryScores.sort((a, b) => b.score - a.score);

  // Assign ranks using dense ranking
  let rank = 1;
  for (let i = 0; i < countryScores.length; i++) {
    if (i > 0 && countryScores[i].score < countryScores[i - 1].score) {
      rank = i + 1; // Adjust rank if the score is lower
    }

    // Add rank to the country score object
    countryScores[i].rank = rank;

    // If the current country matches the target country, return its rank
    if (countryScores[i].countryId.equals(new ObjectId(countryId))) {
      return rank;
    }
  }

  // If the country is not found, return null or a default value
  return null;
}

// src/utils/calculations.js
function calculateStrength(countryScore, worldAvgScore) {
  // Convert scores from strings (e.g., "14.29%") to numbers
  const countryScoreValue = parseFloat(countryScore.replace("%", ""));
  const worldAvgScoreValue = parseFloat(worldAvgScore.replace("%", ""));

  // Calculate the difference between Country Score and World Avg. Score
  const difference = countryScoreValue - worldAvgScoreValue;

  // Determine strength based on the difference
  if (difference > 10) {
    return "Strong";
  } else if (difference < -10) {
    return "Weak";
  } else {
    return "Average";
  }
}

module.exports = {
  calculateRatifiedInstruments,
  calculateCountryScore,
  calculateWorldAvgScore,
  calculateCountryRank,
  calculateStrength,
};
