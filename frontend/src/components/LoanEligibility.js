import React, { useState } from 'react';

const COHERE_API_KEY = 'dlX6MLnZpRwTYT1bD5IZNzTI8pq9V1nqjO8swbEn';

const LoanEligibility = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    income: '',
    employmentStatus: '',
    creditScore: '',
    loanAmount: '',
  });

  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const predictEligibility = async () => {
    setLoading(true);
    const prompt = `
Act as a loan officer. Based on the following user data, determine if they are eligible for a loan. Just reply "Eligible" or "Not Eligible".

Name: ${formData.name}
Age: ${formData.age}
Annual Income (LPA): ₹${formData.income}
Employment Status (Full-time, Part-time, Business, Unemployed): ${formData.employmentStatus}
Credit Score (out of 900): ${formData.creditScore}
Loan Amount Requested (in ₹): ₹${formData.loanAmount}
`;

    try {
      const response = await fetch('https://api.cohere.ai/v1/chat', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          model: 'command-r',
        }),
      });

      const data = await response.json();
      setResult(data.text || data.reply || 'No response');
    } catch (err) {
      console.error('Prediction error:', err);
      setResult('Error during prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center text-4xl">🔍</div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Check Loan Eligibility
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            AI-powered loan approval with instant prediction
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="card">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input-field"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="age" className="form-label">Age (in years)</label>
              <input
                id="age"
                name="age"
                type="number"
                required
                className="input-field"
                placeholder="e.g., 25"
                value={formData.age}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="income" className="form-label">Annual Income (in LPA)</label>
              <input
                id="income"
                name="income"
                type="number"
                required
                className="input-field"
                placeholder="e.g., 5"
                value={formData.income}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="employmentStatus" className="form-label">Employment Type</label>
              <select
                id="employmentStatus"
                name="employmentStatus"
                required
                className="input-field"
                value={formData.employmentStatus}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Business">Business</option>
                <option value="Unemployed">Unemployed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="creditScore" className="form-label">Credit Score (out of 900)</label>
              <input
                id="creditScore"
                name="creditScore"
                type="number"
                required
                className="input-field"
                placeholder="e.g., 750"
                value={formData.creditScore}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="loanAmount" className="form-label">Loan Amount (in ₹)</label>
              <input
                id="loanAmount"
                name="loanAmount"
                type="number"
                required
                className="input-field"
                placeholder="e.g., 200000"
                value={formData.loanAmount}
                onChange={handleChange}
              />
            </div>

            <button
              onClick={predictEligibility}
              disabled={loading}
              className={`w-full btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Checking...
                </div>
              ) : (
                'Check Eligibility'
              )}
            </button>

            {result && (
              <div className="mt-4 p-3 rounded-lg border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                <strong>Result:</strong> {result}
              </div>
            )}
          </div>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Your data is processed securely via AI. No credit score impact.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoanEligibility;
