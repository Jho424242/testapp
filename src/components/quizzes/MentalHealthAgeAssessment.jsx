import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import Protocol from '../Protocol';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

const MentalHealthAgeAssessment = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [testDate, setTestDate] = useState(new Date());

  const questions = [
    { id: 'q1', text: 'Do you feel stressed often?' },
    { id: 'q2', text: 'Do you have a strong social network?' },
    { id: 'q3', text: 'Do you practice mindfulness or meditation?' },
  ];

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const calculateResult = async () => {
    let score = 25;
    if (answers.q1 === 'yes') score += 10;
    if (answers.q2 === 'no') score += 5;
    if (answers.q3 === 'no') score += 5;
    setResult(score);

    const { error } = await supabase
      .from('quiz_attempts')
      .insert([
        { user_id: user.id, quiz_name: 'mental_health_assessment', score: score, answers: answers, created_at: testDate }
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
      <h3 className="text-2xl font-bold text-indigo-800 mb-6">{t('mental_health_assessment')}</h3>
      {result === null ? (
        <div>
          <div className="mb-4">
            <label className="block text-gray-700">{t('test_date')}</label>
            <DatePicker
              selected={testDate}
              onChange={(date) => setTestDate(date)}
              className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
          {questions.map((q) => (
            <div key={q.id} className="mb-4">
              <p className="font-semibold">{q.text}</p>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    className="form-radio h-6 w-6 text-indigo-600 border-2 border-indigo-300 focus:ring-indigo-500"
                    name={q.id}
                    value="yes"
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 text-indigo-600"
                    name={q.id}
                    value="no"
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </div>
          ))}
          <button
            onClick={calculateResult}
            className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-md text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
          >
            Calculate
          </button>
        </div>
      ) : (
        <div>
          <div className="space-y-6">
            <p className="text-2xl font-bold text-indigo-800">Your estimated mental health age is:</p>
            <p className="text-4xl font-extrabold text-purple-700">{result} years</p>
          </div>
          <Protocol quizName="mental_health_assessment" score={result} />
        </div>
      )}
    </div>
  );
};

export default MentalHealthAgeAssessment;
