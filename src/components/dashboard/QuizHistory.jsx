import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const QuizHistory = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        setLoading(true);
        const { data, error } = await supabase
          .from('quiz_attempts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) {
          console.log('Error fetching quiz history:', error);
        } else {
          setHistory(data);
        }
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const formattedHistory = history.reduce((acc, attempt) => {
    const date = new Date(attempt.created_at).toLocaleDateString();
    let dateEntry = acc.find(entry => entry.date === date);
    if (!dateEntry) {
      dateEntry = { date };
      acc.push(dateEntry);
    }
    dateEntry[attempt.quiz_name] = attempt.score;
    return acc;
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h4 className="text-xl font-bold text-gray-800 mb-4">{t('your_progress_over_time')}</h4>
      {loading ? (
        <p>{t('loading_history')}</p>
      ) : history.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={formattedHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="longevity_quiz" name={t('longevity_quiz')} stroke="#8884d8" connectNulls />
            <Line type="monotone" dataKey="blood_age_calculator" name={t('blood_age_calculator')} stroke="#82ca9d" connectNulls />
            <Line type="monotone" dataKey="mental_health_assessment" name={t('mental_health_assessment')} stroke="#ffc658" connectNulls />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">{t('no_quiz_history')}</p>
          <p className="text-gray-500">{t('take_a_quiz_to_start')}</p>
        </div>
      )}
    </div>
  );
};

export default QuizHistory;
