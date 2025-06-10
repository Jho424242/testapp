import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/dashboard/Dashboard';
import { useTranslation } from 'react-i18next';
import QuizHistory from '../components/dashboard/QuizHistory';

const DashboardPage = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('dashboard')}</h1>
        <div className="bg-white shadow rounded-lg p-8 mb-8">
            <p className="text-center text-gray-500">
            {t('welcome_user', { email: user?.email })}
            </p>
        </div>
        <Dashboard />
        <div className="mt-8">
            <QuizHistory />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
