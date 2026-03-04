import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings as SettingsIcon, UserX, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { handleApiError } from '../utils/errorHandler';

export function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteConfirm.toLowerCase() !== 'delete') {
      alert('Please type DELETE to confirm.');
      return;
    }
    setDeleting(true);
    try {
      await api.delete('/auth/me');
      logout();
      navigate('/login');
    } catch (err) {
      alert(handleApiError(err) || 'Failed to delete account.');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setDeleteConfirm('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12">
      <div className="max-w-2xl mx-auto px-4 md:px-6 pt-6 md:pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back</span>
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-slate-200 rounded-xl">
            <SettingsIcon className="w-6 h-6 text-slate-700" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Settings</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Account</h2>
            <p className="text-sm text-slate-500">Manage your account and data</p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50 rounded-xl">
                  <UserX className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Delete account</p>
                  <p className="text-sm text-slate-500">Permanently remove your account and data. This cannot be undone.</p>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors shrink-0"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-red-100 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Delete account?</h3>
            </div>
            <p className="text-slate-600 text-sm mb-4">
              This will permanently delete your account and all associated data. Type <strong>DELETE</strong> below to confirm.
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl mb-4 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm('');
                }}
                disabled={deleting}
                className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirm.toLowerCase() !== 'delete'}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white font-semibold rounded-xl transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
