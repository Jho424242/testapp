import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import QuizHistory from './QuizHistory';
import Protocol from '../Protocol';
import DailyCheckin from '../DailyCheckin';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, updateSubscription } = useAuth();
  const [recommendations, setRecommendations] = useState({});

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

  useEffect(() => {
    const fetchRecommendations = async () => {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching quiz attempts:', error);
      } else {
        const latestRecommendations = {};
        data.forEach(attempt => {
          if (!latestRecommendations[attempt.quiz_name]) {
            latestRecommendations[attempt.quiz_name] = { score: attempt.score };
          }
        });
        setRecommendations(latestRecommendations);
      }
    };

    fetchRecommendations();
  }, [user.id]);

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

      <DailyCheckin />

      {recommendations && recommendations.mental_health_assessment && (
        <div>
          <h3 className="text-2xl font-bold text-gray-700 mb-4">Mental Health Protocol</h3>
          <Protocol quizName="mental_health_assessment" score={recommendations.mental_health_assessment.score} />
        </div>
      )}

      {recommendations && recommendations.longevity_quiz && (
        <div>
          <h3 className="text-2xl font-bold text-gray-700 mb-4">Longevity Protocol</h3>
          <Protocol quizName="longevity_quiz" score={recommendations.longevity_quiz.score} />
        </div>
      )}

      {recommendations && recommendations.blood_age_calculator && (
        <div>
          <h3 className="text-2xl font-bold text-gray-700 mb-4">Blood Age Protocol</h3>
          <Protocol quizName="blood_age_calculator" score={recommendations.blood_age_calculator.score} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
