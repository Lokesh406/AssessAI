import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assignmentAPI, submissionAPI, gradeAPI } from '../utils/api';
import { FiCheckCircle, FiClock, FiLogOut, FiSend, FiUser, FiAward, FiHome } from 'react-icons/fi';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState({});
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
    // Refresh data every 5 seconds to show real-time updates (fast)
    const interval = setInterval(fetchAllData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch assignments
      const assignmentsResponse = await assignmentAPI.getStudentAssignments();
      setAssignments(assignmentsResponse.data);

      // Fetch grades
      const gradesResponse = await gradeAPI.getStudentGrades();
      const gradesMap = {};
      gradesResponse.data.forEach(grade => {
        gradesMap[grade.assignment] = grade;
      });
      setGrades(gradesMap);

      // Fetch submissions
      const submissionsResponse = await submissionAPI.getStudentSubmissions();
      const submissionsMap = {};
      submissionsResponse.data.forEach(submission => {
        submissionsMap[submission.assignment] = submission;
      });
      setSubmissions(submissionsMap);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (assignment) => {
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    const grade = grades[assignment._id];

    // If there's a grade and it has been graded
    if (grade && grade.gradedAt) {
      return { status: 'Evaluated', color: 'green', icon: FiAward };
    }
    
    // If submitted but not graded yet
    if (assignment.submitted) {
      return { status: 'Submitted', color: 'blue', icon: FiCheckCircle };
    }
    
    // If overdue
    if (now > dueDate) {
      return { status: 'Overdue', color: 'red', icon: FiClock };
    }
    
    // Pending submission
    return { status: 'Pending', color: 'orange', icon: FiClock };
  };

  const getSortedAssignments = () => {
    let sorted = [...assignments];
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'a-z':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'z-a':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'due-soon':
        sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        break;
      case 'due-later':
        sorted.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
        break;
      default:
        break;
    }
    return sorted;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/student-home')}
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition cursor-pointer"
            >
              📊 AssessAI
            </button>
            <div className="hidden sm:block h-8 w-px bg-gray-200" />
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/student-home')}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-gray-900 px-4 py-2 rounded-lg border border-emerald-200 transition font-semibold"
            >
              <FiHome /> Home
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-gray-900 px-4 py-2 rounded-lg border border-blue-200 transition font-semibold"
            >
              <FiUser /> Profile
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg transition font-semibold shadow-sm"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-blue-100 text-sm font-semibold">Total Assignments</p>
            <p className="text-4xl font-bold mt-2">{assignments.length}</p>
            <p className="text-blue-100 text-xs mt-2">Tracked by AssessAI</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-green-100 text-sm font-semibold">Completed</p>
            <p className="text-4xl font-bold mt-2">{assignments.filter(a => a.submitted).length}</p>
            <p className="text-green-100 text-xs mt-2">Successfully submitted</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-purple-100 text-sm font-semibold">Evaluated</p>
            <p className="text-4xl font-bold mt-2">{Object.values(grades).filter(g => g.gradedAt).length}</p>
            <p className="text-purple-100 text-xs mt-2">AI feedback received</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-orange-100 text-sm font-semibold">Pending</p>
            <p className="text-4xl font-bold mt-2">{assignments.filter(a => !a.submitted).length}</p>
            <p className="text-orange-100 text-xs mt-2">Awaiting submission</p>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Your Assignments</h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setLoading(true);
                  fetchAllData();
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition"
              >
                🔄 Refresh
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">📅 Newest First</option>
                <option value="oldest">📅 Oldest First</option>
                <option value="a-z">A-Z (Title)</option>
                <option value="z-a">Z-A (Title)</option>
                <option value="due-soon">⏰ Due Soon</option>
                <option value="due-later">⏰ Due Later</option>
              </select>
            </div>
          </div>
          {loading ? (
            <p className="text-gray-600">Loading assignments...</p>
          ) : assignments.length === 0 ? (
            <p className="text-gray-600">No assignments yet. Check back soon!</p>
          ) : (
            getSortedAssignments().map(assignment => {
              const statusInfo = getStatus(assignment);
              const StatusIcon = statusInfo.icon;
              const colors = {
                green: 'bg-green-100 text-green-800 border-green-300',
                red: 'bg-red-100 text-red-800 border-red-300',
                orange: 'bg-orange-100 text-orange-800 border-orange-300',
                blue: 'bg-blue-100 text-blue-800 border-blue-300',
              };

              const grade = grades[assignment._id];
              const isEvaluated = grade && grade.gradedAt;
              const percentage = isEvaluated ? ((grade.totalScore / grade.maxScore) * 100).toFixed(1) : null;

              return (
                <div key={assignment._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    {/* Left Section: Title + Difficulty */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <h3 className="text-xl font-bold text-gray-900">{assignment.title}</h3>
                        {assignment.difficultyLevel && (
                          <span className={`inline-block px-4 py-2 rounded-full text-white font-bold text-sm 
                            ${assignment.difficultyLevel === 'easy' ? 'bg-blue-500' : assignment.difficultyLevel === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`}
                          >
                            {assignment.difficultyLevel.charAt(0).toUpperCase() + assignment.difficultyLevel.slice(1)}
                          </span>
                        )}
                        <span className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm ${colors[statusInfo.color]}`}>
                          <StatusIcon size={16} />
                          {statusInfo.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{assignment.description}</p>
                    </div>
                    
                    {/* Right Section: Button/Grade Display */}
                    <div className="ml-4 flex flex-col items-end gap-4">
                      {isEvaluated && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Your Score</p>
                          <p className="text-3xl font-bold text-green-600">{grade.totalScore}</p>
                          <p className="text-xs text-gray-500">out of {grade.maxScore}</p>
                          <p className="text-lg font-bold text-blue-600 mt-2">{percentage}%</p>
                        </div>
                      )}
                      <button
                        onClick={() => navigate(`/assignment/${assignment._id}`)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition whitespace-nowrap"
                      >
                        <FiSend /> {assignment.submitted ? 'View' : 'Start'}
                      </button>
                    </div>
                  </div>

                  {/* Bottom Section: Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Type</p>
                      <p className="text-sm font-semibold text-gray-900">{assignment.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Points</p>
                      <p className="text-sm font-bold text-blue-600">{assignment.totalPoints}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Due Date</p>
                      <p className="text-sm font-semibold text-gray-900">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Difficulty</p>
                      <p className={`text-sm font-bold 
                        ${assignment.difficultyLevel === 'easy' ? 'text-blue-600' : assignment.difficultyLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                        {assignment.difficultyLevel ? assignment.difficultyLevel.charAt(0).toUpperCase() + assignment.difficultyLevel.slice(1) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Status</p>
                      <p className={`text-sm font-semibold ${statusInfo.color === 'green' ? 'text-green-600' : statusInfo.color === 'blue' ? 'text-blue-600' : statusInfo.color === 'red' ? 'text-red-600' : 'text-orange-600'}`}>
                        {statusInfo.status}
                      </p>
                    </div>
                  </div>

                  {/* Evaluation Feedback Section */}
                  {isEvaluated && (grade.teacherFeedback || grade.aiGeneratedFeedback) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-semibold text-gray-900 mb-2">📝 Teacher Feedback</p>
                      <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-gray-700">
                        {grade.teacherFeedback || grade.aiGeneratedFeedback}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
