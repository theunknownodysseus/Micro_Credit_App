import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Registration from './components/Registration';

function AppContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [user, setUser] = useState(null);
  const { isDarkMode, toggleTheme } = useTheme();

  const handleRegistrationSuccess = (userData) => {
    console.log('User registered:', userData);
    setUser(userData);
    setCurrentStep(1);
  };

  // Theme toggle component
  const ThemeToggle = () => (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={toggleTheme}
        className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200"
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <span className="text-xl">☀️</span>
        ) : (
          <span className="text-xl">🌙</span>
        )}
      </button>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <Registration onRegistrationSuccess={handleRegistrationSuccess} />;
      case 1:
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="card max-w-lg">
              <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
                🎉 Registration Successful!
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                Welcome {user?.user?.email}! Let's complete your profile to get started.
              </p>
              <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4">
                <div className="text-sm text-green-800 dark:text-green-200">
                  <strong>User ID:</strong> {user?.userId}
                </div>
                <div className="text-sm text-green-800 dark:text-green-200">
                  <strong>Email:</strong> {user?.user?.email}
                </div>
                <div className="text-sm text-green-800 dark:text-green-200">
                  <strong>Mobile:</strong> {user?.user?.mobile}
                </div>
              </div>
              <button
                className="w-full btn-primary mt-6"
                onClick={() => setCurrentStep(2)}
              >
                Complete Profile
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="card max-w-lg">
              <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
                👤 Profile Setup
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                This is where we'll add the detailed profile form next.
              </p>
              <button
                className="w-full btn-secondary"
                onClick={() => setCurrentStep(0)}
              >
                Back to Registration
              </button>
            </div>
          </div>
        );
      default:
        return <Registration onRegistrationSuccess={handleRegistrationSuccess} />;
    }
  };

  return (
    <div className="App">
      <ThemeToggle />
      {renderCurrentStep()}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;