import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle, User, FileText } from 'lucide-react';
import { mockUserVerification, mockProjects } from '@/app/data/mockData';

interface VerificationRequest {
  id: string;
  projectName: string;
  entrepreneur: string;
  status: 'pending' | 'approved' | 'clarification';
  nidPhoto: string;
  nidNumber: string;
  submittedDate: string;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'pending' | 'approved'>('pending');
  
  const [verificationRequests] = useState<VerificationRequest[]>([
    {
      id: '1',
      projectName: mockProjects[0].name,
      entrepreneur: mockProjects[0].entrepreneur,
      status: 'pending',
      nidPhoto: mockUserVerification.nidPhoto,
      nidNumber: mockUserVerification.nidNumber,
      submittedDate: '2026-01-20',
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);

  const handleApprove = (requestId: string) => {
    alert(`Project ${requestId} approved!`);
    setSelectedRequest(null);
  };

  const handleRequestClarification = (requestId: string) => {
    alert(`Clarification requested for project ${requestId}`);
    setSelectedRequest(null);
  };

  const pendingRequests = verificationRequests.filter((r) => r.status === 'pending');
  const approvedRequests = verificationRequests.filter((r) => r.status === 'approved');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-blue-800 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl">Admin Dashboard</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedTab('pending')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              selectedTab === 'pending'
                ? 'bg-white text-blue-900'
                : 'bg-blue-800 text-white hover:bg-blue-700'
            }`}
          >
            Pending ({pendingRequests.length})
          </button>
          <button
            onClick={() => setSelectedTab('approved')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              selectedTab === 'approved'
                ? 'bg-white text-blue-900'
                : 'bg-blue-800 text-white hover:bg-blue-700'
            }`}
          >
            Approved ({approvedRequests.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-6xl mx-auto">
        {selectedRequest ? (
          /* Verification View */
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-blue-50 border-b border-blue-200 p-6">
              <h2 className="mb-2">Verification Review</h2>
              <p className="text-gray-600">{selectedRequest.projectName}</p>
              <p className="text-sm text-gray-500">by {selectedRequest.entrepreneur}</p>
            </div>

            {/* Split Screen Layout */}
            <div className="grid md:grid-cols-2 gap-6 p-6">
              {/* Left: Uploaded NID Photo */}
              <div>
                <h3 className="mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Uploaded NID Photo
                </h3>
                <div className="bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-300">
                  <img
                    src={selectedRequest.nidPhoto}
                    alt="NID"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm">
                    <strong className="text-blue-900">NID Number:</strong>{' '}
                    <span className="text-blue-800">{selectedRequest.nidNumber}</span>
                  </p>
                </div>
              </div>

              {/* Right: Verification Fields */}
              <div>
                <h3 className="mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  Public Verification Data
                </h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Full Name</p>
                    <p>{selectedRequest.entrepreneur}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">NID Number</p>
                    <p className="font-mono">{selectedRequest.nidNumber}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Verification Source</p>
                    <p>NIDA Database</p>
                    <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Cross-referenced successfully
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">RRA/RDB Status</p>
                    <p>TIN: 123456789</p>
                    <p className="text-sm text-yellow-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-4 h-4" />
                      Pending RDB verification
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Submission Date</p>
                    <p>
                      {new Date(selectedRequest.submittedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 p-6 flex gap-4">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => handleRequestClarification(selectedRequest.id)}
                className="flex-1 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <AlertCircle className="w-5 h-5" />
                <span>Request Clarification</span>
              </button>
              <button
                onClick={() => handleApprove(selectedRequest.id)}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Approve Project</span>
              </button>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {(selectedTab === 'pending' ? pendingRequests : approvedRequests).map((request) => (
              <div
                key={request.id}
                onClick={() => setSelectedRequest(request)}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="mb-1">{request.projectName}</h3>
                    <p className="text-gray-600 mb-2">{request.entrepreneur}</p>
                    <p className="text-sm text-gray-500">
                      Submitted on{' '}
                      {new Date(request.submittedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm ${
                      request.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : request.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </div>
                </div>
              </div>
            ))}

            {(selectedTab === 'pending' ? pendingRequests : approvedRequests).length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No {selectedTab} verification requests
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
