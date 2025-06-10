import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

const BloodAgeCalculator = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [biomarkers, setBiomarkers] = useState({
    albumin: '',
    alkalinePhosphatase: '',
    bun: '',
    calcium: '',
    creatinine: '',
    crp: '',
    glucose: '',
    lymphocyte: '',
    rdw: '',
    wbc: '',
    hdl: '',
    ldl: '',
    triglycerides: '',
    hba1c: '',
    il6: '',
    tnfa: '',
    testosterone: '',
    estradiol: '',
    dheas: '',
    progesterone: '',
  });
  const [result, setResult] = useState(null);
  const [testDate, setTestDate] = useState(new Date());

  const handleInputChange = (e) => {
    setBiomarkers({ ...biomarkers, [e.target.name]: e.target.value });
  };

  const calculateResult = async () => {
    const biomarkerData = [
        { name: 'albumin', mean: 4.3, stdDev: 0.2, weight: 3 },
        { name: 'alkalinePhosphatase', mean: 70, stdDev: 20, weight: 2 },
        { name: 'bun', mean: 14, stdDev: 4, weight: 2 },
        { name: 'calcium', mean: 9.5, stdDev: 0.4, weight: 1 },
        { name: 'creatinine', mean: 1, stdDev: 0.3, weight: 2 },
        { name: 'crp', mean: 1.5, stdDev: 2, weight: 1 },
        { name: 'glucose', mean: 95, stdDev: 15, weight: 2 },
        { name: 'lymphocyte', mean: 30, stdDev: 5, weight: 1 },
        { name: 'rdw', mean: 13.5, stdDev: 1.2, weight: 3 },
        { name: 'wbc', mean: 7, stdDev: 2, weight: 2 },
        { name: 'hdl', mean: 55, stdDev: 15, weight: 2 },
        { name: 'ldl', mean: 110, stdDev: 30, weight: 2 },
        { name: 'triglycerides', mean: 130, stdDev: 60, weight: 2 },
        { name: 'hba1c', mean: 5.3, stdDev: 0.5, weight: 3 },
        { name: 'il6', mean: 2, stdDev: 1.2, weight: 3 },
        { name: 'tnfa', mean: 1.5, stdDev: 0.8, weight: 3 },
        { name: 'testosterone', mean: 500, stdDev: 200, weight: 3 },
        { name: 'estradiol', mean: 40, stdDev: 20, weight: 3 },
        { name: 'dheas', mean: 120, stdDev: 40, weight: 3 },
        { name: 'progesterone', mean: 1.2, stdDev: 0.5, weight: 2 },
    ];

    const zScores = biomarkerData.map(b => (biomarkers[b.name] - b.mean) / b.stdDev);
    const weightedZScores = zScores.map((z, i) => z * biomarkerData[i].weight);
    const biologicalAgeDifference = weightedZScores.reduce((a, b) => a + b, 0) / biomarkerData.reduce((a, b) => a + b.weight, 0);
    const chronologicalAge = 41; // Assuming a chronological age of 41 as per the excel file
    const biologicalAge = chronologicalAge + biologicalAgeDifference;

    setResult(biologicalAge.toFixed(2));

    const { error } = await supabase
        .from('quiz_attempts')
        .insert([{ user_id: user.id, quiz_name: 'blood_age_calculator', score: Math.round(biologicalAge), answers: biomarkers, created_at: testDate }]);
    if (error) console.log('Error inserting quiz result:', error);
  };

  return (
    <div className="bg-white shadow rounded-lg p-8">
      <h3 className="text-2xl font-bold mb-6">{t('blood_age_calculator')}</h3>
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
          {Object.keys(biomarkers).map(key => (
            <div key={key} className="mb-4">
              <label className="block text-gray-700">{key}</label>
              <input
                type="number"
                name={key}
                value={biomarkers[key]}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
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
          <p className="text-lg">Your estimated blood age is: {result} years</p>
        </div>
      )}
    </div>
  );
};

export default BloodAgeCalculator;
