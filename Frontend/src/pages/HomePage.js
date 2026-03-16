import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navigation Bar */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                📚 AssessAI
              </div>
            </div>
            <div className="flex gap-4">
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="px-6 py-2 text-gray-700 font-semibold hover:text-blue-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Revolutionize Your
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Academic Experience
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              An intelligent learning management system designed to empower educators and inspire students.
              Seamlessly manage assignments, generate AI-powered feedback, and track academic progress.
            </p>

            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                <Link
                  to="/login"
                  className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-10 py-4 bg-white border-2 border-purple-600 text-purple-600 font-bold text-lg rounded-lg hover:bg-purple-50 hover:shadow-lg transition-all"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Feature Grid - Hero Visual */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-blue-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">AI-Powered Feedback</h3>
              <p className="text-gray-600">
                Get intelligent, personalized feedback on your work with our advanced AI system.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-purple-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Real-time Analytics</h3>
              <p className="text-gray-600">
                Track performance with detailed analytics and visual progress reports.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-pink-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Plagiarism Detection</h3>
              <p className="text-gray-600">
                Advanced similarity checking to ensure academic integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Student Dashboard Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/40">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                FOR STUDENTS
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
                Your Learning
                <span className="block text-blue-600">Command Center</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Stay organized, track your progress, and receive intelligent feedback on every assignment.
                The student dashboard gives you complete visibility into your academic journey.
              </p>

              {/* Features List */}
              <ul className="space-y-4 mt-8">
                {[
                  { icon: '✨', title: 'View Assignments', desc: 'Track all assignments with difficulty levels' },
                  { icon: '📱', title: 'Smart Sorting', desc: 'Filter by deadline, difficulty, or status' },
                  { icon: '🎯', title: 'Real-time Grades', desc: 'See your score and feedback instantly' },
                  { icon: '💡', title: 'AI Insights', desc: 'Get personalized feedback to improve' },
                  { icon: '🏆', title: 'Progress Tracking', desc: 'Monitor your growth over time' },
                ].map((feature, idx) => (
                  <li key={idx} className="flex gap-4 items-start">
                    <span className="text-3xl flex-shrink-0">{feature.icon}</span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{feature.title}</h4>
                      <p className="text-gray-600">{feature.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
                <div className="space-y-4">
                  <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                    <div className="font-semibold mb-2">📝 Data Structures</div>
                    <div className="text-sm opacity-90">Due: Mar 20 • Medium • Submitted</div>
                    <div className="mt-2 flex gap-2">
                      <div className="text-2xl font-bold">85%</div>
                      <div className="text-sm">Great work! Clear code structure...</div>
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                    <div className="font-semibold mb-2">🌐 Web Development</div>
                    <div className="text-sm opacity-90">Due: Mar 25 • Hard • Pending</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                    <div className="font-semibold mb-2">📚 Database Design</div>
                    <div className="text-sm opacity-90">Due: Apr 1 • Easy • Evaluated</div>
                    <div className="mt-2 flex gap-2">
                      <div className="text-2xl font-bold">92%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teacher Dashboard Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Visual */}
            <div className="relative order-2 lg:order-1">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
                <div className="space-y-4">
                  <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                    <div className="font-semibold mb-2">📋 OOP Assignment</div>
                    <div className="text-sm opacity-90">25 Submissions • 3 Pending</div>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                      <div>🟦 Easy</div>
                      <div>🟨 Medium</div>
                      <div>🟥 Hard</div>
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                    <div className="font-semibold mb-2">📊 Analytics</div>
                    <div className="text-sm opacity-90">Avg Score: 78% • Class: 30 Students</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                    <div className="font-semibold mb-2">🔍 Plagiarism Check</div>
                    <div className="text-sm opacity-90">2 Suspicious • 28 Clear</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="space-y-6 order-1 lg:order-2">
              <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                FOR EDUCATORS
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
                Powerful Teaching
                <span className="block text-purple-600">Made Simple</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Manage your classroom efficiently with advanced tools for grading, feedback, and student analytics.
                Focus on teaching while our system handles the administrative work.
              </p>

              {/* Features List */}
              <ul className="space-y-4 mt-8">
                {[
                  { icon: '📝', title: 'Manage Assignments', desc: 'Create and track assignments with ease' },
                  { icon: '⚡', title: 'Quick Grading', desc: 'Grade submissions and add feedback in seconds' },
                  { icon: '📈', title: 'Class Analytics', desc: 'Detailed insights into student performance' },
                  { icon: '🔒', title: 'Integrity Check', desc: 'Built-in plagiarism detection system' },
                  { icon: '💬', title: 'AI Feedback', desc: 'Generate insightful feedback automatically' },
                ].map((feature, idx) => (
                  <li key={idx} className="flex gap-4 items-start">
                    <span className="text-3xl flex-shrink-0">{feature.icon}</span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{feature.title}</h4>
                      <p className="text-gray-600">{feature.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-5xl font-bold text-gray-900">
              Packed with
              <span className="block text-purple-600">Powerful Features</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create an effective learning environment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🎨',
                title: 'Difficulty Levels',
                desc: 'Assignments tagged as Easy, Medium, or Hard helps students prepare',
              },
              {
                icon: '🤖',
                title: 'AI Feedback',
                desc: 'Smart feedback generation based on student performance and answers',
              },
              {
                icon: '📊',
                title: 'Real-time Dashboard',
                desc: 'Live updates of grades, submissions, and student progress',
              },
              {
                icon: '🚀',
                title: 'Quick Sorting',
                desc: 'Filter assignments by date, name, difficulty, and submission status',
              },
              {
                icon: '🔍',
                title: 'Plagiarism Detection',
                desc: 'Advanced similarity checking with exact matched sections highlighted',
              },
              {
                icon: '📱',
                title: 'Responsive Design',
                desc: 'Works perfectly on desktop, tablet, and mobile devices',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-gray-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join thousands of students and teachers already using AssessAI to enhance their academic journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
              <Link
                to="/register"
                className="px-10 py-4 bg-white text-purple-600 font-bold text-lg rounded-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Get Started Now
              </Link>
              <Link
                to="/login"
                className="px-10 py-4 bg-white/20 text-white font-bold text-lg rounded-lg border-2 border-white hover:bg-white/30 transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-gray-300">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold text-white mb-4">📚 AssessAI</div>
              <p className="text-sm">Empowering educators and inspiring students worldwide.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Students</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition">Assignments</a></li>
                <li><a href="#" className="hover:text-white transition">Analytics</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Teachers</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition">Grading</a></li>
                <li><a href="#" className="hover:text-white transition">Reports</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 AssessAI. All rights reserved. Building the future of education.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
