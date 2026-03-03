import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, CheckCircle2, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function DocumentUpload() {
  const navigate = useNavigate();
  const { user, uploadDocuments } = useAuth();
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    selfie: null,
    nida: null,
    tin: null,
  });

  const isEntrepreneur = user?.role === 'entrepreneur';
  const requiredDocs = isEntrepreneur
    ? ['selfie', 'nida', 'tin (optional)']
    : ['selfie', 'nida'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
  if (e.target.files && e.target.files[0]) {
    setFiles({ ...files, [docType]: e.target.files[0] });
  }
};

  const canSubmit = files.selfie && files.nida;

  const handleSubmit = async () => {
  if (!canSubmit) {
    alert('Please upload all required documents');
    return;
  }

  const formData = new FormData();
  if (files.selfie) formData.append('document', files.selfie);
  if (files.nida) formData.append('document', files.nida);
  if (files.tin) formData.append('document', files.tin);

  try {
    // This calls the function in your AuthContext
    await uploadDocuments(formData); 
    navigate('/waiting-approval');
  } catch (err) {
    alert("Upload failed. Please try again.");
  }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white p-4">
        <h1 className="text-xl">Upload Documents</h1>
        <p className="text-sm text-blue-200 mt-1">
          {isEntrepreneur ? 'Entrepreneur' : 'Investor'} Verification
        </p>
      </div>

      <div className="p-6 max-w-2xl mx-auto">
        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="text-blue-900 mb-2">Required Documents:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            {requiredDocs.map((doc, index) => (
              <li key={index}>• {doc}</li>
            ))}
          </ul>
        </div>

        {/* Upload Sections */}
        <div className="space-y-4">
          {/* Selfie */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="mb-1">Live Selfie</h3>
                <p className="text-sm text-gray-600">Take a clear photo of your face</p>
              </div>

              {/* 1. THE HIDDEN INPUT */}
              <input
                type="file"
                id="selfie-input"
                hidden
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'selfie')}
              />
              {/* 2. THE CHECKMARK OR BUTTON */}
              {!files.selfie ? (
                <button
                  type="button"
                  onClick={() => document.getElementById('selfie-input')?.click()}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  <span>Capture Selfie</span>
                </button>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center text-green-700">
                  <p> {files.selfie.name} selected</p>
                </div>
              )}
            </div>
          </div>

          {/* NIDA */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="mb-1">National ID (NIDA)</h3>
                <p className="text-sm text-gray-600">Upload a clear photo of your ID</p>
              </div>

              <input
                type="file"
                id="nida-input"
                hidden
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'nida')}
              />
            
              {!files.nida ? (
                <button
                  type="button"
                  onClick={() => document.getElementById('nida-input')?.click()}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload NIDA</span>
                </button>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center text-green-700">
                  <p>{files.nida?.name} selected</p>
                </div>
              )}
            </div>
          </div>

          {/* TIN (Entrepreneur only) */}
          {isEntrepreneur && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="mb-1">TIN Certificate <span className="text-sm text-gray-500">(Optional)</span></h3>
                  <p className="text-sm text-gray-600">Upload your TIN certificate</p>
                </div>
                {files.tin && (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                )}
              </div>
              {!files.tin ? (
                <button
                  onClick={() => handleFileChange({ target: { files: [null] } } as any, 'tin')}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  <span>Upload TIN (Optional)</span>
                </button>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center text-green-700">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                  <p>TIN uploaded successfully</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full mt-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl transition-colors"
        >
          Submit for Approval
        </button>

        {!canSubmit && (
          <p className="text-center text-sm text-gray-500 mt-2">
            Please upload all required documents to continue
          </p>
        )}
      </div>
    </div>
  );
}
