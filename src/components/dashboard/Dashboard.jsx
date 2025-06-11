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
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="flex justify-between items-center mb-12">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-indigo-900">{t('your_health_dashboard')}</h2>
          <p className="text-indigo-700">{t('welcome_message', { name: user.email })}</p>
        </div>
        <button
          onClick={toggleSubscription}
          className={`font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all ${
            user.user_metadata.subscription === 'pro'
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-white hover:bg-indigo-50 text-indigo-800 border border-indigo-200'
          }`}
        >
          {user.user_metadata.subscription === 'pro' ? t('pro_user') : t('free_user')} ({t('toggle')})
        </button>
      </div>

      <div className="mb-16 space-y-6">
        <h3 className="text-3xl font-bold text-indigo-900 mb-6">{t('available_quizzes')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quizzes.map((quiz) => (
            <Link
              to={quiz.pro && user.user_metadata.subscription !== 'pro' ? '#' : quiz.path}
              key={quiz.name}
              className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                quiz.pro && user.user_metadata.subscription !== 'pro' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-2xl font-bold text-indigo-900">{t(quiz.name)}</h4>
                {quiz.pro && (
                  <span className="bg-indigo-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                    {t('pro')}
                  </span>
                )}
              </div>
              <p className="text-indigo-700">{t(`${quiz.name}_desc`)}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-3xl font-bold text-indigo-900 mb-6">{t('quiz_history')}</h3>
            <QuizHistory />
          </div>
          
          <DailyCheckin className="bg-white p-6 rounded-xl shadow-lg" />
        </div>

        <div className="space-y-8">
          {recommendations && recommendations.mental_health_assessment && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-3xl font-bold text-indigo-900 mb-6">{t('protocol.mental_health')}</h3>
              <Protocol quizName="mental_health_assessment" score={recommendations.mental_health_assessment.score} />
            </div>
          )}

          {recommendations && recommendations.longevity_quiz && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-3xl font-bold text-indigo-900 mb-6">{t('protocol.longevity')}</h3>
              <Protocol quizName="longevity_quiz" score={recommendations.longevity_quiz.score} />
            </div>
          )}

          {recommendations && recommendations.blood_age_calculator && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-3xl font-bold text-indigo-900 mb-6">{t('protocol.blood_age')}</h3>
              <Protocol quizName="blood_age_calculator" score={recommendations.blood_age_calculator.score} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
