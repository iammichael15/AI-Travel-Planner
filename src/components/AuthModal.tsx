import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const { signIn, signUp } = useAuth();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime(time => Math.max(0, time - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldownTime]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (isSignUp && cooldownTime > 0) {
      setError(`Please wait ${cooldownTime} seconds before trying again`);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await (isSignUp ? signUp(email, password) : signIn(email, password));
      
      if (error) {
        if (error.message.includes('email_not_confirmed')) {
          setError('Please check your email and confirm your address before signing in');
        } else if (error.message.includes('over_email_send_rate_limit')) {
          const waitTime = 30; // Set cooldown time to 30 seconds
          setCooldownTime(waitTime);
          setError(`Too many attempts. Please wait ${waitTime} seconds before trying again`);
        } else {
          setError(error.message);
        }
      } else {
        onClose();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const buttonText = isSubmitting 
    ? 'Processing...' 
    : isSignUp 
      ? cooldownTime > 0 
        ? `Wait ${cooldownTime}s` 
        : 'Sign Up' 
      : 'Sign In';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || (isSignUp && cooldownTime > 0)}
            className={`w-full py-2 px-4 rounded-md ${
              isSubmitting || (isSignUp && cooldownTime > 0)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {buttonText}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setCooldownTime(0);
            }}
            className="text-indigo-600 hover:text-indigo-800"
            disabled={isSubmitting}
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}