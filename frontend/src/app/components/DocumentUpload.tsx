import { useEffect, useRef, useState } from 'react';
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
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showSelfiePreview, setShowSelfiePreview] = useState(false);
  const [selfiePreviewUrl, setSelfiePreviewUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pendingSelfieFileRef = useRef<File | null>(null);

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

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    setShowCamera(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err2: any) {
        setCameraError('Could not access camera. Please allow permission or upload a photo instead.');
      }
    }
  };

  const captureSelfie = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, width, height);

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.92)
    );
    if (!blob) return;

    const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: 'image/jpeg' });
    pendingSelfieFileRef.current = file;
    if (selfiePreviewUrl) URL.revokeObjectURL(selfiePreviewUrl);
    setSelfiePreviewUrl(URL.createObjectURL(blob));
    stopCamera();
    setShowSelfiePreview(true);
  };

  const confirmSelfie = () => {
    const file = pendingSelfieFileRef.current;
    if (file) {
      setFiles((prev) => ({ ...prev, selfie: file }));
      pendingSelfieFileRef.current = null;
    }
    if (selfiePreviewUrl) {
      URL.revokeObjectURL(selfiePreviewUrl);
      setSelfiePreviewUrl(null);
    }
    setShowSelfiePreview(false);
    setShowCamera(false);
  };

  const retakeSelfie = () => {
    if (selfiePreviewUrl) {
      URL.revokeObjectURL(selfiePreviewUrl);
      setSelfiePreviewUrl(null);
    }
    pendingSelfieFileRef.current = null;
    setShowSelfiePreview(false);
    startCamera();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleSubmit = async () => {
  if (!canSubmit) {
    alert('Please upload all required documents');
    return;
  }

  const formData = new FormData();
  const docTypes: string[] = [];
  if (files.selfie) { formData.append('document', files.selfie); docTypes.push('selfie'); }
  if (files.nida) { formData.append('document', files.nida); docTypes.push('nid'); }
  if (files.tin) { formData.append('document', files.tin); docTypes.push('tin'); }
  formData.append('documentTypes', JSON.stringify(docTypes));

  try {
    // This calls the function in your AuthContext
    await uploadDocuments(formData); 
    navigate('/waiting-approval');
  } catch (err) {
    alert("Upload failed. Please try again.");
  }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-xl font-semibold text-white">Upload Documents</h1>
        <p className="text-sm text-slate-400 mt-1">
          {isEntrepreneur ? 'Entrepreneur' : 'Investor'} Verification
        </p>
      </div>

      <div className="p-6 max-w-2xl mx-auto">
        {/* Info Box */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-6">
          <h3 className="text-white font-medium mb-2">Required Documents:</h3>
          <ul className="text-sm text-slate-300 space-y-1">
            {requiredDocs.map((doc, index) => (
              <li key={index}>• {doc}</li>
            ))}
          </ul>
        </div>

        {/* Upload Sections */}
        <div className="space-y-4">
          {/* Selfie */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="mb-1 text-white font-medium">Live Selfie</h3>
                <p className="text-sm text-slate-400">Take a clear photo of your face</p>
              </div>

              <input
                type="file"
                id="selfie-input"
                hidden
                accept="image/*"
                capture="user"
                onChange={(e) => handleFileChange(e, 'selfie')}
              />
              {!files.selfie ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  <span>Capture Selfie</span>
                </button>
              ) : (
                <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-4 text-center text-green-300">
                  <p> {files.selfie.name} selected</p>
                </div>
              )}
            </div>
          </div>

          {/* NIDA */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="mb-1 text-white font-medium">National ID (NIDA)</h3>
                <p className="text-sm text-slate-400">Upload a clear photo of your ID</p>
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
                <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-4 text-center text-green-300">
                  <p>{files.nida?.name} selected</p>
                </div>
              )}
            </div>
          </div>

          {/* TIN (Entrepreneur only) */}
          {isEntrepreneur && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="mb-1 text-white font-medium">TIN Certificate <span className="text-sm text-slate-500">(Optional)</span></h3>
                  <p className="text-sm text-slate-400">Upload your TIN certificate</p>
                </div>
              <input
                type="file"
                id="tin-input"
                hidden
                accept="image/*,application/pdf"
                onChange={(e) => handleFileChange(e, 'tin')}
              />
              </div>
              {!files.tin ? (
                <button
                type="button"
                onClick={() => document.getElementById('tin-input')?.click()}
                  className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  <span>Upload TIN (Optional)</span>
                </button>
              ) : (
                <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-4 text-center text-green-300">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                <p>{files.tin.name} selected</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full mt-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white rounded-xl transition-colors font-semibold"
        >
          Submit for Approval
        </button>

        {!canSubmit && (
          <p className="text-center text-sm text-slate-500 mt-2">
            Please upload all required documents to continue
          </p>
        )}
      </div>

      {/* Camera modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">Capture selfie</h3>
                <p className="text-xs text-gray-500">Allow camera permission to continue.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setShowCamera(false);
                  setShowSelfiePreview(false);
                  if (selfiePreviewUrl) {
                    URL.revokeObjectURL(selfiePreviewUrl);
                    setSelfiePreviewUrl(null);
                  }
                  pendingSelfieFileRef.current = null;
                }}
                className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold"
              >
                Close
              </button>
            </div>

            <div className="p-4">
              {showSelfiePreview && selfiePreviewUrl ? (
                <>
                  <div className="rounded-xl overflow-hidden bg-black">
                    <img
                      src={selfiePreviewUrl}
                      alt="Selfie preview"
                      className="w-full h-72 object-contain bg-black"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2 text-center">Preview your photo</p>
                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={retakeSelfie}
                      className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold"
                    >
                      Retake
                    </button>
                    <button
                      type="button"
                      onClick={confirmSelfie}
                      className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    >
                      Use photo
                    </button>
                  </div>
                </>
              ) : cameraError ? (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                  {cameraError}
                </div>
              ) : (
                <>
                  <div className="rounded-xl overflow-hidden bg-black">
                    <video ref={videoRef} className="w-full h-72 object-cover" playsInline muted />
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => document.getElementById('selfie-input')?.click()}
                      className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold"
                    >
                      Upload instead
                    </button>
                    <button
                      type="button"
                      onClick={captureSelfie}
                      disabled={!!cameraError}
                      className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold"
                    >
                      Capture
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
