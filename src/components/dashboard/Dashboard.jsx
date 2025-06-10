import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import QuizHistory from './QuizHistory';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, updateSubscription } = useAuth();

  const quizzes = [
    {
      name: 'longevity_quiz',
      path: '/longevity-quiz',
      pro: false,
    },
    {
      name: 'blood_age_calculator',
      path: '/blood-age-calculator',
      pro: true,
    },
    {
      name: 'mental_health_assessment',
      path: '/mental-health-assessment',
      pro: true,
    },
  ];

  const toggleSubscription = () => {
    const newSubscription = user.user_metadata.subscription === 'pro' ? 'free' : 'pro';
    updateSubscription(newSubscription);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{t('your_health_dashboard')}</h2>
          <p className="text-gray-600">{t('welcome_message', { name: user.email })}</p>
        </div>
        <button
          onClick={toggleSubscription}
          className={`font-bold py-2 px-4 rounded transition-colors ${
            user.user_metadata.subscription === 'pro'
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
        >
          {user.user_metadata.subscription === 'pro' ? t('pro_user') : t('free_user')} ({t('toggle')})
        </button>
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-700 mb-4">{t('available_quizzes')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Link
              to={quiz.pro && user.user_metadata.subscription !== 'pro' ? '#' : quiz.path}
              key={quiz.name}
              className={`bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow transform hover:-translate-y-1 ${
                quiz.pro && user.user_metadata.subscription !== 'pro' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <h4 className="text-xl font-bold mb-2 text-gray-800">{t(quiz.name)}</h4>
                {quiz.pro && (
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {t('pro')}
                  </span>
                )}
              </div>
              <p className="text-gray-600">{t(`${quiz.name}_desc`)}</p>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">{t('quiz_history')}</h3>
        <QuizHistory />
      </div>
    </div>
  );
};

export default Dashboard;
