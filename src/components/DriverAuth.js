import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";
import { ArrowRight, CheckCircle, Smartphone } from 'lucide-react';

const DriverAuth = () => {
  const [method, setMethod] = useState('phone'); // 'phone' or 'google'
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('INPUT_PHONE'); // INPUT_PHONE, INPUT_OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 1. Initialize Recaptcha - ROBUST FIX
  useEffect(() => {
    // Only initialize if we are on the phone tab
    if (method === 'phone') {
      try {
        // Clear any existing verifier to prevent "removed element" errors
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        }

        // Initialize new verifier
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': (response) => {
            // reCAPTCHA solved - allow signInWithPhoneNumber.
            console.log("Recaptcha verified");
          },
          'expired-callback': () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            console.log("Recaptcha expired");
          }
        });
      } catch (err) {
        console.error("Recaptcha Init Error:", err);
      }
    }

    // Cleanup on unmount
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, [method]); // Re-run this whenever 'method' changes

  // 2. Handle Phone Login (Send OTP)
  const handleSendOtp = async () => {
    setLoading(true);
    setError('');
    
    // Ensure verifier exists before calling
    if (!window.recaptchaVerifier) {
      setError("System reloading... please try clicking again in 2 seconds.");
      setLoading(false);
      return;
    }

    const appVerifier = window.recaptchaVerifier;

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      setStep('INPUT_OTP');
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP. Check phone format (+91...) or console errors.");
      // If error occurs, reset captcha
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    }
    setLoading(false);
  };

  // 3. Handle Verify OTP
  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      await window.confirmationResult.confirm(otp);
      navigate('/driver-dashboard');
    } catch (err) {
      setError("Invalid OTP. For testing, use the code you set in Firebase Console.");
    }
    setLoading(false);
  };

  // 4. Handle Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/driver-dashboard');
    } catch (err) {
      console.error(err);
      setError("Google Sign-In failed.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Driver Login</h2>
        <p className="text-gray-500 mb-8">Secure access for emergency responders</p>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

        {/* TABS */}
        <div className="flex gap-4 mb-8 border-b">
          <button 
            onClick={() => setMethod('phone')}
            className={`pb-2 font-medium ${method === 'phone' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
          >
            Phone & OTP
          </button>
          <button 
            onClick={() => setMethod('google')}
            className={`pb-2 font-medium ${method === 'google' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
          >
            Gmail
          </button>
        </div>

        {/* --- METHOD 1: PHONE --- */}
        {method === 'phone' && (
          <div>
            {step === 'INPUT_PHONE' ? (
              <>
                <label className="block text-gray-700 font-bold mb-2">Phone Number</label>
                <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-3 focus-within:border-blue-500 mb-6 transition">
                  <Smartphone className="text-gray-400 mr-2" />
                  <input 
                    type="text" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full outline-none text-gray-700 font-mono text-lg"
                  />
                </div>
                
                {/* ⚠️ CRITICAL FIX: The container must be visible when button is clicked */}
                <div id="recaptcha-container" className="mb-4"></div>

                <button 
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending...' : <>Get OTP <ArrowRight size={20}/></>}
                </button>
              </>
            ) : (
              <>
                <label className="block text-gray-700 font-bold mb-2">Enter OTP</label>
                <div className="mb-6">
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 text-center text-2xl tracking-widest font-mono"
                  />
                  <p className="text-xs text-gray-400 mt-2 text-center">Use test code defined in Firebase</p>
                </div>
                <button 
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  {loading ? 'Verifying...' : <>Verify & Login <CheckCircle size={20}/></>}
                </button>
                <button 
                  onClick={() => setStep('INPUT_PHONE')} 
                  className="w-full mt-4 text-gray-500 text-sm hover:underline"
                >
                  Change Number
                </button>
              </>
            )}
          </div>
        )}

        {/* --- METHOD 2: GOOGLE --- */}
        {method === 'google' && (
          <div className="text-center py-8">
            <button 
              onClick={handleGoogleLogin}
              className="w-full border-2 border-gray-200 py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
              <span className="font-bold text-gray-700">Continue with Google</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default DriverAuth;