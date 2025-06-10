import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import LongevityQuizPage from './pages/LongevityQuizPage';
import BloodAgeCalculatorPage from './pages/BloodAgeCalculatorPage';
import MentalHealthAgeAssessmentPage from './pages/MentalHealthAgeAssessmentPage';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/longevity-quiz"
          element={
            <ProtectedRoute>
              <LongevityQuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blood-age-calculator"
          element={
            <ProtectedRoute>
              <BloodAgeCalculatorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mental-health-assessment"
          element={
            <ProtectedRoute>
              <MentalHealthAgeAssessmentPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </MainLayout>
  );
}

export default App;
