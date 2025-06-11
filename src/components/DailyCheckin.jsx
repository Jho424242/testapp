import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import enRecommendations from '../recommendations';
import deRecommendations from '../recommendations.de';

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

        const recommendations = i18n.language === 'de' ? deRecommendations : enRecommendations;
        let allRecommendations = [];
        if (latestRecommendations.mental_health_assessment) {
          const mhaScore = latestRecommendations.mental_health_assessment.score;
          const mhaLevel = mhaScore < 50 ? 'low' : 'high';
          allRecommendations = allRecommendations.concat(recommendations.mental_health_assessment[mhaLevel]);
        }
        if (latestRecommendations.longevity_quiz) {
          const lqScore = latestRecommendations.longevity_quiz.score;
          const lqLevel = lqScore < 50 ? 'low' : 'high';
          allRecommendations = allRecommendations.concat(recommendations.longevity_quiz[lqLevel]);
        }
        if (latestRecommendations.blood_age_calculator) {
          const bacScore = latestRecommendations.blood_age_calculator.score;
          const bacLevel = bacScore < 50 ? 'low' : 'high';
          allRecommendations = allRecommendations.concat(recommendations.blood_age_calculator[bacLevel]);
        }

        setAvailableRecommendations(allRecommendations);
      }
    };

    fetchRecommendations();
  }, [user.id, i18n.language]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate feeling rating before submission
    if (feelingRating < 1 || feelingRating > 10) {
      alert(t('validation.rating_range'));
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
          alert(t('validation.save_error'));
          return;
        }
        
        // Clear the form on success
        setCheckinDate(new Date());
        setFeelingRating(5);
        setNotes('');
        setTrackedRecommendations([]);
        alert(t('validation.save_success'));
      })
      .catch(err => {
        console.error('Unexpected error:', err);
        alert(t('validation.unexpected_error'));
      });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg rounded-xl p-8 transition-all duration-300 hover:shadow-xl">
      <h3 className="text-3xl font-bold mb-8 text-indigo-800">{t('daily_checkin')}</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label htmlFor="dateInput" className="block text-sm font-medium text-indigo-700">{t('date')}</label>
          <input
            id="dateInput"
            type="date"
            className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            value={checkinDate.toISOString().slice(0, 10)}
            onChange={(e) => setCheckinDate(new Date(e.target.value))}
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="feelingRatingInput" className="block text-sm font-medium text-indigo-700">{t('feeling_rating')}</label>
          <div className="relative pt-1">
            <input
              id="feelingRatingInput"
              type="range"
              min="1"
              max="10"
              className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
              value={feelingRating}
              onChange={(e) => setFeelingRating(parseInt(e.target.value))}
            />
            <div className="flex justify-between text-xs text-indigo-600 mt-2">
              <span>{t('rating_scale.low')}</span>
              <span>{t('rating_scale.mid')}</span>
              <span>{t('rating_scale.high')}</span>
            </div>
          </div>
          <div className="text-center text-lg font-semibold text-indigo-800 animate-pulse">
            {t('current_rating', { rating: feelingRating })}
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="notesInput" className="block text-sm font-medium text-indigo-700">{t('notes')}</label>
          <textarea
            id="notesInput"
            className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all min-h-[100px]"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('notes_placeholder', { defaultValue: 'How are you feeling today?' })}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-indigo-700">{t('tracked_recommendations')}</label>
          <div className="space-y-2 max-h-60 overflow-y-auto p-2">
            {availableRecommendations.map((rec, index) => (
              <div 
                key={index} 
                className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
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
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-indigo-300 rounded transition-all"
                />
                <label htmlFor={`rec-${index}`} className="ml-3 block text-sm text-gray-700">
                  {rec}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02]"
        >
          {t('submit')}
        </button>
      </form>
    </div>
  );
};

export default DailyCheckin;
