import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Progress } from '@radix-ui/react-progress';

export function EntrepreneurVerification() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [nidUploaded, setNidUploaded] = useState(false);

  const progress = (step / 3) * 100;

  const handleSelfieUpload = () => {
    setSelfieUploaded(true);
    setTimeout(() => setStep(2), 500);
  };

  const handleNidUpload = () => {
    setNidUploaded(true);
    setTimeout(() => setStep(3), 500);
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
          <h1 className="text-xl">Identity Verification</h1>
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
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <Camera className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="mb-2">Take a Live Selfie</h2>
              <p className="text-gray-600">
                Please take a clear photo of your face for identity verification
              </p>
            </div>

            <div className="border-4 border-dashed border-gray-300 rounded-xl p-12 text-center">
              {!selfieUploaded ? (
                <button
                  onClick={handleSelfieUpload}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                >
                  <Camera className="w-6 h-6" />
                  <span>Capture Selfie</span>
                </button>
              ) : (
                <div className="text-green-600">
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-2" />
                  <p>Selfie captured successfully!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                <Upload className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="mb-2">Upload National ID</h2>
              <p className="text-gray-600">
                Please upload a clear photo of your National ID card
              </p>
            </div>

            <div className="border-4 border-dashed border-gray-300 rounded-xl p-12 text-center">
              {!nidUploaded ? (
                <button
                  onClick={handleNidUpload}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                >
                  <Upload className="w-6 h-6" />
                  <span>Upload NID Photo</span>
                </button>
              ) : (
                <div className="text-green-600">
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-2" />
                  <p>NID uploaded successfully!</p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                <strong>Tip:</strong> Make sure your ID number and photo are clearly visible
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
            <h2 className="mb-2">Verification Complete!</h2>
            <p className="text-gray-600 mb-8">
              Your identity documents have been submitted for verification.
              You can now create your pitch card.
            </p>

            <button
              onClick={handleComplete}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
            >
              Create Pitch Card
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
