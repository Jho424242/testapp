import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import recommendations from '../recommendations';

const DailyCheckin = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [checkinDate, setCheckinDate] = useState(new Date());
  const [feelingRating, setFeelingRating] = useState(5);
  const [notes, setNotes] = useState('');
  const [trackedRecommendations, setTrackedRecommendations] = useState([]);
  const [availableRecommendations, setAvailableRecommendations] = useState([]);

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

        let allRecommendations = [];
        if (latestRecommendations.mental_health_assessment) {
          const score = latestRecommendations.mental_health_assessment.score;
          const recommendationLevel = score < 50 ? 'low' : 'high';
          allRecommendations = allRecommendations.concat(recommendations.mental_health_assessment[recommendationLevel]);
        }
        if (latestRecommendations.longevity_quiz) {
          const score = latestRecommendations.longevity_quiz.score;
          const recommendationLevel = score < 50 ? 'low' : 'high';
          allRecommendations = allRecommendations.concat(recommendations.longevity_quiz[recommendationLevel]);
        }
        if (latestRecommendations.blood_age_calculator) {
          const score = latestRecommendations.blood_age_calculator.score;
          const recommendationLevel = score < 50 ? 'low' : 'high';
          allRecommendations = allRecommendations.concat(recommendations.blood_age_calculator[recommendationLevel]);
        }

        setAvailableRecommendations(allRecommendations);
      }
    };

    fetchRecommendations();
  }, [user.id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate feeling rating before submission
    if (feelingRating < 1 || feelingRating > 10) {
      alert('Please select a feeling rating between 1 and 10');
      return;
    }

    supabase
      .from('daily_checkins')
      .insert([{
        user_id: user.id,
        checkin_date: checkinDate.toISOString().split('T')[0],
        feeling_rating: feelingRating,
        notes: notes,
        tracked_recommendations: trackedRecommendations,
      }])
      .then(({ error }) => {
        if (error) {
          console.error('Error inserting daily checkin:', error);
          alert('Failed to save check-in. Please try again.');
          return;
        }
        
        // Clear the form on success
        setCheckinDate(new Date());
        setFeelingRating(5);
        setNotes('');
        setTrackedRecommendations([]);
        alert('Check-in saved successfully!');
      })
      .catch(err => {
        console.error('Unexpected error:', err);
        alert('An unexpected error occurred. Please try again.');
      });
  };

  return (
    <div className="bg-white shadow rounded-lg p-8">
      <h3 className="text-2xl font-bold mb-6">{t('daily_checkin')}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">{t('date')}</label>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded"
            value={checkinDate.toISOString().slice(0, 10)}
            onChange={(e) => setCheckinDate(new Date(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">{t('feeling_rating')}</label>
          <input
            type="range"
            min="1"
            max="10"
            className="w-full"
            value={feelingRating}
            onChange={(e) => setFeelingRating(parseInt(e.target.value))}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
          <div className="text-center mt-1 font-medium">
            Current rating: {feelingRating}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">{t('notes')}</label>
          <textarea
            className="w-full px-3 py-2 border rounded"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">{t('tracked_recommendations')}</label>
          <div className="space-y-2">
            {availableRecommendations.map((rec, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  id={`rec-${index}`}
                  checked={trackedRecommendations.includes(rec)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setTrackedRecommendations([...trackedRecommendations, rec]);
                    } else {
                      setTrackedRecommendations(trackedRecommendations.filter(r => r !== rec));
                    }
                  }}
                  className="mr-2"
                />
                <label htmlFor={`rec-${index}`}>{rec}</label>
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {t('submit')}
        </button>
      </form>
    </div>
  );
};

export default DailyCheckin;
