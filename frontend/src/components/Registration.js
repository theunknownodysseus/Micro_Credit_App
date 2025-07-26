import React, { useState } from 'react';
import axios from 'axios';

const Registration = ({ onRegistrationSuccess }) => {
    const [formData, setFormData] = useState({
        email: '',
        mobile: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/users/register', formData);
            console.log('Registration successful:', response.data);
            onRegistrationSuccess(response.data);
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="mx-auto h-12 w-12 flex items-center justify-center text-4xl">
                        💰
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Welcome to MicroCredit
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Get instant micro loans with AI-powered approval
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="card">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="input-field"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="mobile" className="form-label">
                                Mobile Number
                            </label>
                            <input
                                id="mobile"
                                name="mobile"
                                type="tel"
                                required
                                className="input-field"
                                placeholder="Enter your mobile number"
                                value={formData.mobile}
                                onChange={handleChange}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Registering...
                                </div>
                            ) : (
                                'Get Started'
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        By registering, you agree to our terms and conditions
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Registration;