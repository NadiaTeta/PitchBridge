import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, ShieldAlert, ArrowRight, X, RotateCcw, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function DocumentUpload() {
  const navigate = useNavigate();
  const { user, uploadDocuments } = useAuth();

  const [files, setFiles] = useState<{ [key: string]: File | null }>({ selfie: null, nida: null });
  const [previews, setPreviews] = useState<{ [key: string]: string | null }>({ selfie: null, nida: null });
  const [isUploading, setIsUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [streamReady, setStreamReady] = useState(false); // NEW

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pendingStreamRef = useRef<MediaStream | null>(null); // NEW
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    return () => {
      Object.values(previews).forEach(url => { if (url) URL.revokeObjectURL(url); });
      stopCamera();
    };
  }, []);

  // NEW: attach stream after modal renders and videoRef exists
  useEffect(() => {
    if (streamReady && showCamera && videoRef.current && pendingStreamRef.current) {
      videoRef.current.srcObject = pendingStreamRef.current;
      videoRef.current.play().catch(() => {
        setCameraError('Could not start video stream. Please try again.');
      });
      setStreamReady(false);
      pendingStreamRef.current = null;
    }
  }, [streamReady, showCamera]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    setFiles(prev => ({ ...prev, selfie: null }));
    setPreviews(prev => ({ ...prev, selfie: null }));

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      streamRef.current = stream;
      pendingStreamRef.current = stream; // store for the effect to pick up
      setShowCamera(true);
      setStreamReady(true); // trigger effect after render
    } catch (err) {
      setCameraError('Camera access denied. Please check browser permissions.');
      setShowCamera(true);
    }
  };

  const captureSelfie = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);
    setTimeout(() => setIsCapturing(false), 150);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: 'image/jpeg' });
        setFiles(prev => ({ ...prev, selfie: file }));
        setPreviews(prev => ({ ...prev, selfie: URL.createObjectURL(blob) }));
      }
    }, 'image/jpeg', 0.95);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles(prev => ({ ...prev, [docType]: file }));
      if (file.type.startsWith('image/')) {
        setPreviews(prev => ({ ...prev, [docType]: URL.createObjectURL(file) }));
      }
    }
  };

  const handleSubmit = async () => {
    setIsUploading(true);
    const formData = new FormData();
    if (files.selfie) formData.append('document', files.selfie);
    if (files.nida) formData.append('document', files.nida);
    formData.append('documentTypes', JSON.stringify(['selfie', 'nid']));

    try {
      await uploadDocuments(formData);
      navigate('/waiting-approval');
    } catch (err) {
      alert("Error uploading documents. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Brand Side */}
      <div className="hidden md:flex md:w-1/3 bg-slate-950 flex-col justify-center items-center p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600 rounded-full blur-[140px] opacity-10" />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-3xl mb-12 shadow-2xl mx-auto">P</div>
          <h2 className="text-4xl font-bold mb-6 tracking-tight">Identity <br/>Verification.</h2>
          <p className="text-slate-400 leading-relaxed mb-10 text-lg max-w-xs mx-auto">
            To ensure a high-trust environment, we require a live selfie and a copy of your National ID.
          </p>
          <div className="p-5 bg-slate-800/50 border border-slate-700 rounded-2xl flex items-center gap-4 text-left max-w-xs mx-auto">
            <ShieldAlert className="text-amber-500 w-8 h-8 flex-shrink-0" />
            <p className="text-xs text-slate-300 leading-tight font-medium">Poor quality photos will be rejected by our system.</p>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-xl">
          <div className="mb-10 text-center md:text-left">
            <h3 className="text-3xl font-bold text-slate-900">Final Verification</h3>
            <p className="text-slate-500 mt-2">Required for {user?.role} status approval.</p>
          </div>

          <div className="grid gap-6">
            <UploadCard
              title="National ID (NIDA)"
              description="Front view of your ID card"
              onAction={() => document.getElementById('nida-input')?.click()}
              file={files.nida}
              preview={previews.nida}
              icon={<Upload className="w-5 h-5" />}
              onClear={() => {
                setFiles(prev => ({ ...prev, nida: null }));
                setPreviews(prev => ({ ...prev, nida: null }));
              }}
            />
            <input type="file" id="nida-input" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'nida')} />

            <UploadCard
              title="Live Selfie"
              description="Real-time face verification"
              onAction={startCamera}
              file={files.selfie}
              preview={previews.selfie}
              icon={<Camera className="w-5 h-5" />}
              onClear={() => {
                setFiles(prev => ({ ...prev, selfie: null }));
                setPreviews(prev => ({ ...prev, selfie: null }));
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!files.nida || !files.selfie || isUploading}
            className="w-full mt-10 py-5 bg-blue-600 text-white rounded-3xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:bg-slate-100 disabled:text-slate-400 flex items-center justify-center gap-4 active:scale-[0.98]"
          >
            {isUploading ? <Loader2 className="animate-spin" /> : <>Finalize Submission <ArrowRight className="w-5 h-5" /></>}
          </button>
        </div>
      </div>

      {/* Canvas lives here — always in the DOM so canvasRef is never null */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-sm space-y-8 text-center text-white">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight">
                {previews.selfie ? "Looks Good?" : "Face Verification"}
              </h3>
              <p className="text-slate-400 text-sm">
                {previews.selfie ? "Ensure your face is clearly visible." : "Position your face inside the circle."}
              </p>
              {/* Show camera error if permission denied */}
              {cameraError && (
                <p className="text-red-400 text-sm bg-red-950/50 rounded-xl p-3">{cameraError}</p>
              )}
            </div>

            <div className="relative aspect-square w-full rounded-full border-4 border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.3)] overflow-hidden bg-slate-900">
              {previews.selfie ? (
                <img src={previews.selfie} className="w-full h-full object-cover scale-x-[-1]" alt="Selfie Preview" />
              ) : (
                <video ref={videoRef} className="w-full h-full object-cover scale-x-[-1]" playsInline muted />
              )}
              {isCapturing && <div className="absolute inset-0 bg-white z-10 animate-pulse" />}
              {!previews.selfie && <div className="absolute inset-0 border-[30px] border-black/40 pointer-events-none rounded-full" />}
            </div>

            <div className="flex flex-col gap-4">
              {!previews.selfie ? (
                <>
                  <button
                    onClick={captureSelfie}
                    disabled={!!cameraError}
                    className="w-full py-4 bg-white text-black rounded-2xl font-black text-lg hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Capture Photo
                  </button>
                  <button
                    onClick={() => { stopCamera(); setShowCamera(false); }}
                    className="text-slate-400 font-bold hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { stopCamera(); setShowCamera(false); }}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl"
                  >
                    Confirm & Use
                  </button>
                  <button
                    onClick={() => {
                      if (previews.selfie) URL.revokeObjectURL(previews.selfie);
                      setPreviews(prev => ({ ...prev, selfie: null }));
                      setFiles(prev => ({ ...prev, selfie: null }));
                      startCamera();
                    }}
                    className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" /> Retake Photo
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UploadCard({ title, description, onAction, file, preview, icon, onClear }: any) {
  return (
    <div className={`p-6 border-2 rounded-[2rem] transition-all duration-300 ${file ? 'border-green-500 bg-green-50/20' : 'border-slate-100 bg-slate-50 hover:border-blue-200'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl transition-colors ${file ? 'bg-green-500 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>{icon}</div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm tracking-tight">{title}</h4>
            <p className="text-xs text-slate-500 font-medium">{file ? 'Document Selected' : description}</p>
          </div>
        </div>
        <div>
          {!file ? (
            <button onClick={onAction} className="bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm">
              Add
            </button>
          ) : (
            <button onClick={onClear} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      {preview && (
        <div className="mt-5 rounded-2xl h-44 w-full overflow-hidden border border-slate-200 bg-black relative group">
          <img src={preview} className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Ready to Verify</span>
          </div>
        </div>
      )}
    </div>
  );
}