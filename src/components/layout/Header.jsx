import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            WLXR
          </Link>
          <div className="flex items-center">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
                {t('dashboard')}
              </Link>
              <Link to="/subscription" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
                {t('subscription_plans')}
              </Link>
            </div>
            <div className="flex items-center ml-6">
              <LanguageSwitcher />
              {user && (
                <button
                  onClick={signOut}
                  className="ml-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                  {t('signout')}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
