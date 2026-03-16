import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assignmentAPI, gradeAPI } from '../utils/api';
import { FiArrowRight, FiBookOpen, FiCalendar, FiClock, FiTarget, FiTrendingUp, FiUser } from 'react-icons/fi';

const StudentHomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setError('');
        const [assignmentsRes, gradesRes] = await Promise.all([
          assignmentAPI.getStudentAssignments(),
          gradeAPI.getStudentGrades(),
        ]);
        setAssignments(Array.isArray(assignmentsRes?.data) ? assignmentsRes.data : []);
        setGrades(Array.isArray(gradesRes?.data) ? gradesRes.data : []);
      } catch (fetchError) {
        setError(fetchError?.message || 'Failed to load student home data');
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  const overview = useMemo(() => {
    const total = assignments.length;
    const submitted = assignments.filter((a) => a?.submitted).length;
    const pending = total - submitted;

    const evaluatedGrades = grades.filter((g) => typeof g?.totalScore === 'number' && typeof g?.maxScore === 'number' && g.maxScore > 0);
    const avgScore = evaluatedGrades.length > 0
      ? (evaluatedGrades.reduce((sum, g) => sum + ((g.totalScore / g.maxScore) * 100), 0) / evaluatedGrades.length)
      : 0;

    const completion = total > 0 ? Math.round((submitted / total) * 100) : 0;

    return {
      total,
      submitted,
      pending,
      avgScore: avgScore.toFixed(1),
      completion,
    };
  }, [assignments, grades]);

  const upcomingAssignments = useMemo(() => {
    const now = new Date();
    return assignments
      .filter((a) => !a?.submitted && a?.dueDate)
      .filter((a) => new Date(a.dueDate) >= now)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  }, [assignments]);

  const recentFeedback = useMemo(() => {
    return grades
      .filter((g) => g?.teacherFeedback || g?.aiGeneratedFeedback)
      .sort((a, b) => new Date(b?.gradedAt || 0) - new Date(a?.gradedAt || 0))
      .slice(0, 4);
  }, [grades]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#d1fae5_0%,_#ecfeff_35%,_#f8fafc_100%)] px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <section className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-xl p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-emerald-100 font-semibold tracking-wide uppercase text-sm">Student Home</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2">Welcome, {user?.firstName || 'Student'}</h1>
              <p className="text-emerald-100 mt-3 max-w-2xl text-base sm:text-lg">
                Your full learning cockpit is here. Track assignments, monitor feedback quality, and stay ahead of upcoming deadlines.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
              <button
                className="bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl px-4 py-3 text-left transition"
                onClick={() => navigate('/student-dashboard')}
              >
                <div className="font-bold">Open Dashboard</div>
                <div className="text-emerald-50 text-sm mt-1">Assignments and submissions</div>
              </button>
              <button
                className="bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl px-4 py-3 text-left transition"
                onClick={() => navigate('/profile')}
              >
                <div className="font-bold">My Profile</div>
                <div className="text-emerald-50 text-sm mt-1">Update personal details</div>
              </button>
              <button
                className="bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl px-4 py-3 text-left transition"
                onClick={() => navigate('/')}
              >
                <div className="font-bold">Public Landing</div>
                <div className="text-emerald-50 text-sm mt-1">Visit main website home</div>
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3">{error}</div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">Total Assignments</p>
              <FiBookOpen className="text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-3">{loading ? '...' : overview.total}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">Submitted</p>
              <FiTarget className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-3">{loading ? '...' : overview.submitted}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-orange-100 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">Pending</p>
              <FiClock className="text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-3">{loading ? '...' : overview.pending}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">Avg Score</p>
              <FiTrendingUp className="text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-3">{loading ? '...' : `${overview.avgScore}%`}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-cyan-100 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">Completion</p>
              <FiUser className="text-cyan-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-3">{loading ? '...' : `${overview.completion}%`}</p>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Deadlines</h2>
              <button
                onClick={() => navigate('/student-dashboard')}
                className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                View all <FiArrowRight />
              </button>
            </div>

            {loading ? (
              <p className="text-gray-500">Loading upcoming assignments...</p>
            ) : upcomingAssignments.length === 0 ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-emerald-700">
                Great work. You have no upcoming pending assignments.
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAssignments.map((assignment) => (
                  <div key={assignment._id} className="border border-gray-200 rounded-xl p-4 hover:border-emerald-300 transition">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="font-bold text-gray-900">{assignment.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{assignment.description || 'No description available.'}</p>
                      </div>
                      <div className="text-sm text-gray-700 inline-flex items-center gap-2">
                        <FiCalendar /> {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Feedback</h2>

            {loading ? (
              <p className="text-gray-500">Loading feedback...</p>
            ) : recentFeedback.length === 0 ? (
              <p className="text-gray-500">No feedback available yet.</p>
            ) : (
              <div className="space-y-3">
                {recentFeedback.map((grade) => (
                  <div key={grade._id} className="rounded-xl border border-gray-200 p-3">
                    <p className="text-sm font-semibold text-gray-900">{grade?.assignment?.title || 'Assignment'}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(grade?.gradedAt || Date.now()).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                      {grade?.teacherFeedback || grade?.aiGeneratedFeedback}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Productivity Focus</h2>
          <div className="w-full bg-gray-100 rounded-full h-3 mb-3 overflow-hidden">
            <div
              className="h-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${overview.completion}%` }}
            />
          </div>
          <p className="text-gray-600 text-sm">
            You have completed <span className="font-semibold text-gray-900">{overview.completion}%</span> of your current assignment load.
            Keep momentum by finishing the nearest due tasks first.
          </p>
        </section>
      </div>
    </div>
  );
};

export default StudentHomePage;
