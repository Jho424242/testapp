import React from 'react';
import recommendations from '../recommendations';

const Protocol = ({ quizName, score }) => {
  let recommendationLevel = 'high';
  if (score < 50) {
    recommendationLevel = 'low';
  }

  const protocolRecommendations = recommendations[quizName]?.[recommendationLevel] || [];

  return (
    <div>
      <h3>Personalized Recommendations</h3>
      <ul>
        {protocolRecommendations.map((recommendation, index) => (
          <li key={index}>{recommendation}</li>
        ))}
      </ul>
    </div>
  );
};

export default Protocol;
