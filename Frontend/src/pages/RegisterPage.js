import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    className: '10',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        formData.role,
        formData.role === 'student' ? formData.className : undefined
      );
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📚 AssessAI
          </Link>
          <p className="text-gray-600">
            Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:text-purple-600 transition">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="pt-20 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Project Overview */}
          <div className="space-y-10 lg:sticky lg:top-24">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900">
                Join the
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AssessAI Community
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Become part of a thriving community of educators and students revolutionizing the way we learn and teach.
              </p>
            </div>

            {/* What You'll Get */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">What You'll Get</h3>

              <div className="space-y-4">
                {/* Student Benefits */}
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-blue-100">
                  <h4 className="font-bold text-lg text-blue-700 mb-3">👨‍🎓 As a Student</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex gap-2 items-start">
                      <span className="text-blue-600">✓</span>
                      <span>Track all your assignments in one place</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="text-blue-600">✓</span>
                      <span>Get intelligent AI-powered feedback instantly</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="text-blue-600">✓</span>
                      <span>See your grades and performance analytics</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="text-blue-600">✓</span>
                      <span>Filter by difficulty level or deadline</span>
                    </li>
                  </ul>
                </div>

                {/* Teacher Benefits */}
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-purple-100">
                  <h4 className="font-bold text-lg text-purple-700 mb-3">👨‍🏫 As a Teacher</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex gap-2 items-start">
                      <span className="text-purple-600">✓</span>
                      <span>Create and manage multiple assignments</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="text-purple-600">✓</span>
                      <span>Grade submissions quickly with built-in tools</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="text-purple-600">✓</span>
                      <span>Detect plagiarism with advanced analysis</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="text-purple-600">✓</span>
                      <span>View detailed class analytics and reports</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔒</span>
                <div>
                  <p className="font-semibold text-gray-900">Secure & Private</p>
                  <p className="text-sm text-gray-600">Your data is encrypted and protected</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">⚡</span>
                <div>
                  <p className="font-semibold text-gray-900">Fast & Reliable</p>
                  <p className="text-sm text-gray-600">Built on modern cloud infrastructure</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">🌍</span>
                <div>
                  <p className="font-semibold text-gray-900">Free to Start</p>
                  <p className="text-sm text-gray-600">Create your account in seconds</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
              {/* Welcome Text */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                <p className="text-gray-600 mt-2">Join thousands using AssessAI today</p>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3 text-sm">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3 text-sm">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">Email Address</label>
                  <div className="flex items-center border-2 border-gray-200 rounded-lg px-4 py-3 focus-within:border-blue-600 focus-within:shadow-lg transition-all">
                    <FiMail className="text-gray-400 mr-3 text-lg" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="flex-1 outline-none text-gray-700"
                      required
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">I am a:</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: 'student' }))}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                        formData.role === 'student'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      👨‍🎓 Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: 'teacher' }))}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                        formData.role === 'teacher'
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      👨‍🏫 Teacher
                    </button>
                  </div>
                </div>

                {/* Class Selection (for students) */}
                {formData.role === 'student' && (
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Class/Grade Level</label>
                    <select
                      name="className"
                      value={formData.className}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 transition-all"
                      required
                    >
                      <option value="">Select your class</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(cls => (
                        <option key={cls} value={cls}>Class {cls}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Password Input */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">Password</label>
                  <div className="flex items-center border-2 border-gray-200 rounded-lg px-4 py-3 focus-within:border-blue-600 focus-within:shadow-lg transition-all">
                    <FiLock className="text-gray-400 mr-3 text-lg" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="flex-1 outline-none text-gray-700"
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">Confirm Password</label>
                  <div className="flex items-center border-2 border-gray-200 rounded-lg px-4 py-3 focus-within:border-blue-600 focus-within:shadow-lg transition-all">
                    <FiLock className="text-gray-400 mr-3 text-lg" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="flex-1 outline-none text-gray-700"
                      required
                    />
                  </div>
                </div>

                {/* Terms Checkbox */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" required />
                  <span className="text-sm text-gray-600">
                    I agree to the <span className="text-blue-600 font-semibold">Terms</span> and <span className="text-blue-600 font-semibold">Privacy Policy</span>
                  </span>
                </label>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-lg font-bold text-white text-lg transition-all bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Create My Account'}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="text-gray-500 text-sm">or</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              {/* Sign In Link */}
              <p className="text-center text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-purple-600 font-bold transition">
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Security Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                <span>✓</span>
                No credit card required to get started
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
