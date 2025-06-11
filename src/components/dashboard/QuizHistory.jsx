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
    <div className="bg-white shadow-xl rounded-xl p-8 hover:shadow-2xl transition-all duration-300">
      <h4 className="text-2xl font-bold text-indigo-900 mb-6">{t('your_progress_over_time')}</h4>
      {loading ? (
        <p>{t('loading_history')}</p>
      ) : history.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={formattedHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#4f46e5" />
            <YAxis stroke="#4f46e5" />
            <Tooltip 
              contentStyle={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="longevity_quiz" name={t('longevity_quiz')} stroke="#5b21b6" strokeWidth={3} connectNulls />
            <Line type="monotone" dataKey="blood_age_calculator" name={t('blood_age_calculator')} stroke="#0d9488" strokeWidth={3} connectNulls />
            <Line type="monotone" dataKey="mental_health_assessment" name={t('mental_health_assessment')} stroke="#db2777" strokeWidth={3} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center py-12">
          <p className="text-indigo-700">{t('no_quiz_history')}</p>
          <p className="text-indigo-700">{t('take_a_quiz_to_start')}</p>
        </div>
      )}
    </div>
  );
};

export default QuizHistory;
