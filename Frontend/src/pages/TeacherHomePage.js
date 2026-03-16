import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assignmentAPI, analyticsAPI } from '../utils/api';
import { FiActivity, FiArrowRight, FiBookOpen, FiCalendar, FiClock, FiLayers, FiPieChart, FiUser } from 'react-icons/fi';

const TeacherHomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [dashboardAnalytics, setDashboardAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeacherHomeData = async () => {
      try {
        setError('');
        const [assignmentsRes, analyticsRes] = await Promise.all([
          assignmentAPI.getTeacherAssignments(),
          analyticsAPI.getDashboardAnalytics(),
        ]);
        setAssignments(Array.isArray(assignmentsRes?.data) ? assignmentsRes.data : []);
        setDashboardAnalytics(analyticsRes?.data || null);
      } catch (fetchError) {
        setError(fetchError?.message || 'Failed to load teacher home data');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherHomeData();
  }, []);

  const assignmentStats = useMemo(() => {
    const now = new Date();
    const total = assignments.length;
    const overdue = assignments.filter((a) => new Date(a?.dueDate || 0) < now).length;
    const active = total - overdue;
    const quizCount = assignments.filter((a) => a?.type === 'quiz').length;
    return {
      total,
      overdue,
      active,
      quizCount,
    };
  }, [assignments]);

  const recentAssignments = useMemo(() => {
    return [...assignments]
      .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
      .slice(0, 5);
  }, [assignments]);

  const upcomingDue = useMemo(() => {
    const now = new Date();
    return assignments
      .filter((a) => new Date(a?.dueDate || 0) >= now)
      .sort((a, b) => new Date(a?.dueDate || 0) - new Date(b?.dueDate || 0))
      .slice(0, 4);
  }, [assignments]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#dbeafe_0%,_#eef2ff_35%,_#f8fafc_100%)] px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <section className="rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white shadow-xl p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-indigo-100 font-semibold tracking-wide uppercase text-sm">Teacher Home</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2">Welcome, {user?.firstName || 'Teacher'}</h1>
              <p className="text-indigo-100 mt-3 max-w-2xl text-base sm:text-lg">
                Your classroom control center is live. Create assignments faster, track grading load, and monitor outcomes in one full-screen workspace.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
              <button
                className="bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl px-4 py-3 text-left transition"
                onClick={() => navigate('/teacher-dashboard')}
              >
                <div className="font-bold">Dashboard</div>
                <div className="text-indigo-50 text-sm mt-1">Assignments and grading tools</div>
              </button>
              <button
                className="bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl px-4 py-3 text-left transition"
                onClick={() => navigate('/profile')}
              >
                <div className="font-bold">Profile</div>
                <div className="text-indigo-50 text-sm mt-1">Manage account and settings</div>
              </button>
              <button
                className="bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl px-4 py-3 text-left transition"
                onClick={() => navigate('/')}
              >
                <div className="font-bold">Public Landing</div>
                <div className="text-indigo-50 text-sm mt-1">Open website front page</div>
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3">{error}</div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">Total Assignments</p>
              <FiBookOpen className="text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-3">{loading ? '...' : (dashboardAnalytics?.totalAssignments ?? assignmentStats.total)}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-cyan-100 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">Total Submissions</p>
              <FiLayers className="text-cyan-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-3">{loading ? '...' : (dashboardAnalytics?.totalSubmissions ?? 0)}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-orange-100 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">Pending Grading</p>
              <FiClock className="text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-3">{loading ? '...' : (dashboardAnalytics?.pendingGrading ?? 0)}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">Average Class Score</p>
              <FiPieChart className="text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-3">{loading ? '...' : `${Number(dashboardAnalytics?.averageClassScore || 0).toFixed(1)}%`}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">Overdue Assignments</p>
              <FiActivity className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-3">{loading ? '...' : assignmentStats.overdue}</p>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Assignments</h2>
              <button
                onClick={() => navigate('/teacher-dashboard')}
                className="inline-flex items-center gap-2 text-indigo-700 hover:text-indigo-800 font-semibold"
              >
                Open dashboard <FiArrowRight />
              </button>
            </div>

            {loading ? (
              <p className="text-gray-500">Loading recent assignments...</p>
            ) : recentAssignments.length === 0 ? (
              <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-4 text-indigo-700">
                No assignments yet. Create your first assignment from the dashboard.
              </div>
            ) : (
              <div className="space-y-3">
                {recentAssignments.map((assignment) => (
                  <div key={assignment._id} className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="font-bold text-gray-900">{assignment.title}</p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{assignment.description || 'No description available.'}</p>
                        <div className="mt-2 inline-flex gap-2 text-xs">
                          <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">{assignment.type || 'assignment'}</span>
                          <span className="px-2 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">{assignment.totalPoints || 0} pts</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 inline-flex items-center gap-2">
                        <FiCalendar /> {assignment?.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Due Dates</h2>
            {loading ? (
              <p className="text-gray-500">Loading due schedule...</p>
            ) : upcomingDue.length === 0 ? (
              <p className="text-gray-500">No upcoming due dates.</p>
            ) : (
              <div className="space-y-3">
                {upcomingDue.map((assignment) => (
                  <div key={assignment._id} className="rounded-xl border border-gray-200 p-3">
                    <p className="text-sm font-semibold text-gray-900">{assignment.title}</p>
                    <p className="text-xs text-gray-500 mt-1">Due {new Date(assignment.dueDate).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-5 border-t border-gray-200">
              <button
                onClick={() => navigate('/profile')}
                className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-3 font-semibold transition"
              >
                <FiUser /> Open Profile
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Course Mix Snapshot</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm text-blue-700 font-semibold">Active Assignments</p>
              <p className="text-2xl font-bold text-blue-900 mt-2">{loading ? '...' : assignmentStats.active}</p>
            </div>
            <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
              <p className="text-sm text-violet-700 font-semibold">Quiz Assignments</p>
              <p className="text-2xl font-bold text-violet-900 mt-2">{loading ? '...' : assignmentStats.quizCount}</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-sm text-emerald-700 font-semibold">Healthy Progress</p>
              <p className="text-sm text-emerald-900 mt-2">
                {loading
                  ? 'Calculating...'
                  : `${dashboardAnalytics?.pendingGrading || 0} submissions need grading now.`}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TeacherHomePage;
