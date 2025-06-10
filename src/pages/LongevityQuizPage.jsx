import React from 'react';
import { Link } from 'react-router-dom';
import LongevityQuiz from '../components/quizzes/LongevityQuiz';
import { useTranslation } from 'react-i18next';

const LongevityQuizPage = () => {
    const { t } = useTranslation();
  return (
    <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
            <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-800">
                &larr; {t('back_to_dashboard')}
            </Link>
        </div>
      <LongevityQuiz />
    </div>
  );
};

export default LongevityQuizPage;
