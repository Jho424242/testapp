import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import Protocol from '../Protocol';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

const LongevityQuiz = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [testDate, setTestDate] = useState(new Date());

  const questions = [
    { id: 'q1', text: 'Do you smoke?' },
    { id: 'q2', text: 'Do you exercise regularly?' },
    { id: 'q3', text: 'Do you eat a balanced diet?' },
    { id: 'q4', text: 'Do you get enough sleep?' },
  ];

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const calculateResult = async () => {
    let score = 80;
    if (answers.q1 === 'yes') score -= 10;
    if (answers.q2 === 'no') score -= 5;
    if (answers.q3 === 'no') score -= 5;
    if (answers.q4 === 'no') score -= 5;
    setResult(score);

    const { error } = await supabase
      .from('quiz_attempts')
      .insert([
        { user_id: user.id, quiz_name: 'longevity_quiz', score: score, answers: answers, created_at: testDate }
      ]);
    if (error) {
      console.log('Error inserting quiz result:', error);
      alert('Failed to save quiz result. Please try again.');
    } else {
      alert('Quiz result saved successfully!');
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg rounded-xl p-8 transition-all duration-300 hover:shadow-xl">
      <h3 className="text-3xl font-bold mb-8 text-indigo-800">{t('longevity_quiz')}</h3>
      {result === null ? (
        <div className="space-y-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-indigo-700">{t('test_date')}</label>
            <DatePicker
              selected={testDate}
              onChange={(date) => setTestDate(date)}
              className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
          {questions.map((q) => (
            <div key={q.id} className="space-y-2">
              <p className="text-lg font-semibold text-indigo-700">{q.text}</p>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <div className="relative">
                    <input
                      type="radio"
                      className="sr-only"
                      name={q.id}
                      value="yes"
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    />
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${answers[q.id] === 'yes' ? 'border-indigo-600 bg-indigo-100' : 'border-gray-300'}`}>
                      {answers[q.id] === 'yes' && <div className="w-3 h-3 rounded-full bg-indigo-600"></div>}
                    </div>
                  </div>
                  <span className="text-gray-700">Yes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <div className="relative">
                    <input
                      type="radio"
                      className="sr-only"
                      name={q.id}
                      value="no"
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    />
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${answers[q.id] === 'no' ? 'border-indigo-600 bg-indigo-100' : 'border-gray-300'}`}>
                      {answers[q.id] === 'no' && <div className="w-3 h-3 rounded-full bg-indigo-600"></div>}
                    </div>
                  </div>
                  <span className="text-gray-700">No</span>
                </label>
              </div>
            </div>
          ))}
          <button
            onClick={calculateResult}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02]"
          >
            {t('calculate')}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <h4 className="text-xl font-semibold text-indigo-700 mb-2">{t('your_result')}</h4>
            <div className="text-4xl font-bold text-indigo-800 animate-pulse">
              {result} {t('years')}
            </div>
            <p className="text-gray-600 mt-2">{t('longevity_quiz_result_description')}</p>
          </div>
          <Protocol quizName="longevity_quiz" score={result} />
        </div>
      )}
    </div>
  );
};

export default LongevityQuiz;
