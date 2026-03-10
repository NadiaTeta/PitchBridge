import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Progress } from '@radix-ui/react-progress';
import Webcam from 'react-webcam';

export function EntrepreneurVerification() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [nidUploaded, setNidUploaded] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const progress = (step / 3) * 100;

  // 1. Unified Upload Logic
  const handleUpload = async (file: File, type: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const token = localStorage.getItem('token');
      
      // Update this URL to match your Render backend URL
      const response = await fetch('https://pitchbridge-backend.onrender.com/api/v1/users/upload-document', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        if (type === 'selfie') {
          setSelfieUploaded(true);
          setTimeout(() => setStep(2), 1000);
        } else if (type === 'nid') {
          setNidUploaded(true);
          setTimeout(() => setStep(3), 1000);
        }
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Something went wrong with the upload.");
    }
  };

  // 2. Selfie Capture Logic
  const captureAndUpload = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (imageSrc) {
      // Convert base64 to Blob
      const blob = await fetch(imageSrc).then(res => res.blob());
      const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
      await handleUpload(file, 'selfie');
    }
  }, [webcamRef]);

  // 3. NID File Selection Logic
  const onNidFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0], 'nid');
    }
  };

  const handleComplete = () => {
    navigate('/entrepreneur/pitch-card');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-blue-900 text-white p-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-blue-800 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Identity Verification</h1>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Step {step} of 3</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3 w-full bg-blue-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </Progress>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-2xl mx-auto">
        {/* STEP 1: SELFIE */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
               <h2 className="text-2xl font-bold mb-2">Take a Live Selfie</h2>
               <p className="text-gray-600">Ensure your face is well-lit and clearly visible.</p>
            </div>
            <div className="border-4 border-black rounded-xl overflow-hidden bg-black aspect-video relative">
              {!selfieUploaded ? (
                <>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={captureAndUpload}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-8 py-3 bg-green-600 text-white font-bold rounded-full shadow-lg hover:bg-green-700"
                  >
                    CAPTURE PHOTO
                  </button>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center bg-white">
                  <CheckCircle2 className="w-16 h-16 text-green-600 mb-2" />
                  <p className="font-bold">Selfie Uploaded to Cloudinary!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: NATIONAL ID */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                <Upload className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Upload National ID</h2>
              <p className="text-gray-600">Upload a clear photo of your ID card (Front).</p>
            </div>

            <div className="border-4 border-dashed border-gray-300 rounded-xl p-12 text-center">
              {!nidUploaded ? (
                <label className="cursor-pointer inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors">
                  <Upload className="w-6 h-6" />
                  <span>Choose File / Take Photo</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*,.pdf" 
                    onChange={onNidFileChange} 
                  />
                </label>
              ) : (
                <div className="text-green-600">
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-2" />
                  <p className="font-bold">NID Document Uploaded!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: COMPLETE */}
        {step === 3 && (
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Verification Complete!</h2>
            <p className="text-gray-600 mb-8">
              Documents submitted. Our team will review your identity shortly.
            </p>

            <button
              onClick={handleComplete}
              className="w-full px-8 py-4 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold transition-colors"
            >
              Go to Pitch Deck
            </button>
          </div>
        )}
      </div>
    </div>
  );
}