import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiUser, FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const getInitials = (firstName = '', lastName = '') => {
  const a = (firstName || '').trim();
  const b = (lastName || '').trim();
  const first = a ? a[0] : '';
  const second = b ? b[0] : '';
  const initials = (first + second).toUpperCase();
  return initials || 'U';
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, refreshProfile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    profilePicture: '',
    className: '',
  });

  const roleLabel = useMemo(() => {
    if (user?.role === 'teacher') return 'Teacher';
    if (user?.role === 'student') return 'Student';
    return 'User';
  }, [user?.role]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const res = await authAPI.getProfile();
        const profile = res.data;
        if (cancelled) return;

        setForm({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          bio: profile.bio || '',
          profilePicture: profile.profilePicture || '',
          className: profile.className || '',
        });
      } catch (e) {
        toast.error(e?.response?.data?.message || e?.message || 'Failed to load profile');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const onSave = async (e) => {
    e.preventDefault();

    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error('First name and last name are required');
      return;
    }

    if (user?.role === 'student' && !String(form.className || '').trim()) {
      toast.error('Class is required for students');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        bio: form.bio,
        profilePicture: form.profilePicture || null,
      };

      if (user?.role === 'student') {
        payload.className = String(form.className).trim();
      }

      const res = await authAPI.updateProfile(payload);
      toast.success(res.data?.message || 'Profile updated');

      await refreshProfile();
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-6 text-gray-700">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition cursor-pointer"
            >
              📊 AssessAI
            </button>
            <div className="hidden sm:block h-8 w-px bg-gray-200" />
            <button
              type="button"
              onClick={() => navigate(user?.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard')}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-semibold transition px-3 py-2 rounded-lg hover:bg-blue-50"
            >
              <FiArrowLeft /> Back
            </button>
            <h1 className="hidden sm:block text-xl font-bold text-gray-900">Profile</h1>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left: Profile card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 text-white lg:sticky lg:top-24">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-4">
              {form.profilePicture ? (
                <img
                  src={form.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-lg flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-24 h-24 sm:w-20 sm:h-20 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-4xl sm:text-3xl shadow-lg flex-shrink-0">
                  {getInitials(form.firstName, form.lastName)}
                </div>
              )}

              <div className="min-w-0 text-center sm:text-left">
                <p className="font-bold text-3xl sm:text-2xl text-white break-words">
                  {form.firstName} {form.lastName}
                </p>
                <p className="text-base sm:text-sm text-blue-100 break-all mt-1">{user?.email}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm sm:text-xs font-bold bg-white/20 text-white px-4 sm:px-3 py-2 sm:py-1 rounded-full border border-white/40 backdrop-blur-sm">
                  <FiUser /> {roleLabel}
                  {user?.role === 'student' && form.className ? (
                    <span className="text-blue-100">• Class {form.className}</span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-10 sm:mt-8 border-t border-white/20 pt-8 sm:pt-6">
              <p className="text-base sm:text-xs font-bold text-blue-100 mb-3 sm:mb-2 uppercase tracking-wide">Bio</p>
              <p className="text-base sm:text-sm text-blue-50 whitespace-pre-wrap min-h-[5rem] sm:min-h-[4rem] leading-relaxed">
                {form.bio?.trim() ? form.bio : 'No bio yet. Add one in the edit section!'}
              </p>
            </div>

            <div className="mt-8 sm:mt-6 pt-8 sm:pt-6 border-t border-white/20 space-y-4 sm:space-y-3">
              <div>
                <span className="text-xs sm:text-xs font-bold text-blue-100 uppercase tracking-wide block mb-1">Role</span>
                <p className="text-lg sm:text-sm font-semibold text-white">{roleLabel}{user?.role === 'student' ? ' at Class ' + form.className : ''}</p>
              </div>
              <div>
                <span className="text-xs sm:text-xs font-bold text-blue-100 uppercase tracking-wide block mb-1">Email</span>
                <p className="text-base sm:text-sm font-semibold text-white break-all">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Right: Edit form */}
          <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <h2 className="text-3xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 mb-4 sm:mb-0">
                <span className="text-4xl sm:text-3xl">✏️</span> Edit Profile
              </h2>
              {!editMode && (
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 sm:py-2 rounded-lg transition shadow-md text-lg sm:text-base"
                >
                  <FiEdit2 /> Edit
                </button>
              )}
            </div>
            <p className="text-lg sm:text-base text-gray-600 mb-8">Update your personal information on AssessAI.</p>

            <form onSubmit={onSave} className="mt-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg sm:text-base font-semibold text-gray-700 mb-3">First Name</label>
                  <input
                    value={form.firstName}
                    onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 text-lg sm:text-base"
                    required
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <label className="block text-lg sm:text-base font-semibold text-gray-700 mb-3">Last Name</label>
                  <input
                    value={form.lastName}
                    onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 text-lg sm:text-base"
                    required
                    disabled={!editMode}
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg sm:text-base font-semibold text-gray-700 mb-3">Email</label>
                <input
                  value={user?.email || ''}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-600 text-lg sm:text-base"
                  disabled
                />
                <p className="text-sm sm:text-xs text-gray-500 mt-2">Email can't be changed.</p>
              </div>

              {user?.role === 'student' && (
                <div>
                  <label className="block text-lg sm:text-base font-semibold text-gray-700 mb-3">Class</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={form.className}
                    onChange={(e) => setForm((p) => ({ ...p, className: String(e.target.value) }))}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 text-lg sm:text-base"
                    required
                    disabled={!editMode}
                  />
                </div>
              )}

              <div>
                <label className="block text-lg sm:text-base font-semibold text-gray-700 mb-3">Profile Picture URL (optional)</label>
                <input
                  value={form.profilePicture}
                  onChange={(e) => setForm((p) => ({ ...p, profilePicture: e.target.value }))}
                  placeholder="https://..."
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 text-lg sm:text-base"
                  disabled={!editMode}
                />
              </div>

              <div>
                <label className="block text-lg sm:text-base font-semibold text-gray-700 mb-3">Bio (optional)</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                  rows={7}
                  placeholder="Tell us a bit about yourself..."
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 text-lg sm:text-base"
                  disabled={!editMode}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    if (editMode) setEditMode(false);
                    else navigate(user?.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-2 rounded-lg font-semibold transition"
                >
                  {editMode ? 'Cancel' : 'Back'}
                </button>
                <button
                  type="submit"
                  disabled={saving || !editMode}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 text-white px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2 shadow-md"
                >
                  <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
