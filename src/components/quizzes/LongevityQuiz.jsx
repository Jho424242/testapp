import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
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
      .insert([{ user_id: user.id, quiz_name: 'longevity_quiz', score: score, answers: answers, created_at: testDate }]);
    if (error) console.log('Error inserting quiz result:', error);
  };

  return (
    <div className="bg-white shadow rounded-lg p-8">
      <h3 className="text-2xl font-bold mb-6">{t('longevity_quiz')}</h3>
      {result === null ? (
        <div>
          <div className="mb-4">
            <label className="block text-gray-700">{t('test_date')}</label>
            <DatePicker
              selected={testDate}
              onChange={(date) => setTestDate(date)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          {questions.map((q) => (
            <div key={q.id} className="mb-4">
              <p className="font-semibold">{q.text}</p>
              <div className="flex items-center space-x-4">
                <label>
                  <input
                    type="radio"
                    name={q.id}
                    value="yes"
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name={q.id}
                    value="no"
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  />
                  No
                </label>
              </div>
            </div>
          ))}
          <button
            onClick={calculateResult}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Calculate
          </button>
        </div>
      ) : (
        <div>
          <p className="text-lg">Your estimated lifespan is: {result} years</p>
        </div>
      )}
    </div>
  );
};

export default LongevityQuiz;
