import React from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import enRecommendations from '../recommendations';
import deRecommendations from '../recommendations.de';

const Protocol = ({ quizName, score }) => {
  const { t } = useTranslation();
  let recommendationLevel = 'high';
  if (score < 50) {
    recommendationLevel = 'low';
  }

  const recommendations = i18n.language === 'de' ? deRecommendations : enRecommendations;
  const protocolRecommendations = recommendations[quizName]?.[recommendationLevel] || [];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg rounded-xl p-8 transition-all duration-300 hover:shadow-xl">
      <h3 className="text-2xl font-bold mb-6 text-indigo-800">
        {t('protocol.personalized_recommendations')}
      </h3>
      <ul className="space-y-3">
        {protocolRecommendations.map((recommendation, index) => (
          <li 
            key={index}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:translate-x-1"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-indigo-500 mt-1 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-700">{recommendation}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Protocol;
