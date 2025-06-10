import React from 'react';
import { Link } from 'react-router-dom';
import MentalHealthAgeAssessment from '../components/quizzes/MentalHealthAgeAssessment';
import { useTranslation } from 'react-i18next';

const MentalHealthAgeAssessmentPage = () => {
    const { t } = useTranslation();
  return (
    <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
            <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-800">
                &larr; {t('back_to_dashboard')}
            </Link>
        </div>
      <MentalHealthAgeAssessment />
    </div>
  );
};

export default MentalHealthAgeAssessmentPage;
