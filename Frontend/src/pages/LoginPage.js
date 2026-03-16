import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('student');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password);
      toast.success('Login successful!');
      navigate(result.user.role === 'teacher' ? '/teacher-home' : '/student-home');
    } catch (error) {
      toast.error(error.message || 'Login failed');
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
            Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:text-purple-600 transition">Create one</Link>
          </p>
        </div>
      </div>

      <div className="pt-20 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Project Description */}
          <div className="space-y-10">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900">
                Welcome to
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AssessAI
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Your intelligent learning management system designed to transform education through AI-powered feedback and seamless collaboration.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Why Choose AssessAI?</h3>

              <div className="space-y-4">
                {/* Feature 1 */}
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">AI-Powered Feedback</h4>
                    <p className="text-gray-600">Get intelligent, personalized feedback on every assignment with our advanced AI system.</p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">Real-time Analytics</h4>
                    <p className="text-gray-600">Track progress with detailed analytics, visual reports, and performance insights.</p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">Plagiarism Detection</h4>
                    <p className="text-gray-600">Advanced similarity checking with matched sections highlighted for academic integrity.</p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">Smart Organization</h4>
                    <p className="text-gray-600">Filter and sort assignments by difficulty, deadline, or status with one click.</p>
                  </div>
                </div>

                {/* Feature 5 */}
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">Difficulty Levels</h4>
                    <p className="text-gray-600">Assignments tagged as Easy, Medium, or Hard to help you prepare effectively.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">1000+</div>
                <p className="text-sm text-gray-600 mt-1">Active Students</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">500+</div>
                <p className="text-sm text-gray-600 mt-1">Teachers</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">5000+</div>
                <p className="text-sm text-gray-600 mt-1">Assignments</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
              {/* User Type Selector */}
              <div className="mb-8">
                <p className="text-gray-700 font-semibold mb-4 text-center">Sign in as:</p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setUserType('student')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                      userType === 'student'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    👨‍🎓 Student
                  </button>
                  <button
                    onClick={() => setUserType('teacher')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                      userType === 'teacher'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    👨‍🏫 Teacher
                  </button>
                </div>
              </div>

              {/* Welcome Text */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  {userType === 'student' ? '👨‍🎓 Student Login' : '👨‍🏫 Teacher Login'}
                </h2>
                <p className="text-gray-600 mt-2">
                  {userType === 'student'
                    ? 'Access your assignments and track your progress'
                    : 'Manage assignments and grade submissions'
                  }
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">Email Address</label>
                  <div className="flex items-center border-2 border-gray-200 rounded-lg px-4 py-3 focus-within:border-blue-600 focus-within:shadow-lg transition-all">
                    <FiMail className="text-gray-400 mr-3 text-lg" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 outline-none text-gray-700"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">Password</label>
                  <div className="flex items-center border-2 border-gray-200 rounded-lg px-4 py-3 focus-within:border-blue-600 focus-within:shadow-lg transition-all">
                    <FiLock className="text-gray-400 mr-3 text-lg" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="flex-1 outline-none text-gray-700"
                      required
                    />
                  </div>
                </div>

                {/* Remember & Forgot Password */}
                <div className="flex justify-between items-center text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <Link to="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Forgot password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-lg font-bold text-white text-lg transition-all ${
                    userType === 'student'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg hover:scale-105'
                      : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:shadow-lg hover:scale-105'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? 'Signing in...' : 'Sign In to ' + (userType === 'student' ? 'Student Dashboard' : 'Teacher Dashboard')}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="text-gray-500 text-sm">or</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              {/* Demo Account Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold">Try Demo Account:</span>
                </p>
                <p className="text-xs text-gray-600">Student: student@example.com / Password: 123456</p>
                <p className="text-xs text-gray-600">Teacher: teacher@example.com / Password: 123456</p>
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:text-purple-600 font-bold transition">
                  Sign up here
                </Link>
              </p>
            </div>

            {/* Security Badge */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                <span>🔒</span>
                Your data is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
