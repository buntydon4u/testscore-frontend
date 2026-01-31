import { FormField } from "@/components/FormField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth";
import { apiClient } from "@/services/api";

export const LoginForm = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");

  const getRoleBasedPath = (role: string): string => {
    const rolePathMap: Record<string, string> = {
      SUPER_ADMIN: '/super-admin/dashboard',
      ADMIN: '/admin/dashboard',
      TEACHER: '/teacher/dashboard',
      STUDENT: '/student/dashboard',
      PARENT: '/parent/dashboard',
      GUEST: '/guest/dashboard',
    };
    return rolePathMap[role] || '/dashboard';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      if (!email || !password) {
        setError("Email and password are required");
        return;
      }

      setIsLoading(true);
      try {
        const response = await authService.login(email, password);
        const redirectPath = getRoleBasedPath(response.user.role);
        navigate(redirectPath);
      } catch (err: unknown) {
        const error = err as { message?: string };
        setError(error.message || "Login failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Signup
      if (!username || !email || !password || !confirmPassword) {
        setError("All fields are required");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      setIsLoading(true);
      try {
        const response = await authService.signup(email, username, password);
        setUserId(response.user.id);
        setShowOtpModal(true);
      } catch (err: unknown) {
        const error = err as { message?: string };
        setError(error.message || "Signup failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post('/auth/verify-email', { userId, otp });
      setShowOtpModal(false);
      navigate("/");
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "OTP verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await apiClient.post('/auth/send-verify-otp', { userId });
      setError("");
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_4px_6px_-1px,rgba(0,0,0,0.1)_0px_2px_4px_-2px] box-border caret-transparent max-w-md w-full p-8 rounded-lg">
        <div className="flex mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-center font-bold ${isLogin ? 'text-slate-600 border-b-2 border-slate-600' : 'text-gray-500'}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-center font-bold ${!isLogin ? 'text-slate-600 border-b-2 border-slate-600' : 'text-gray-500'}`}
          >
            Sign Up
          </button>
        </div>

        <form className="box-border caret-transparent" onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="box-border caret-transparent mb-4">
              <label className="text-gray-800 text-sm font-bold box-border caret-transparent block leading-5 mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="text-gray-800 shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_1px_3px_0px,rgba(0,0,0,0.1)_0px_1px_2px_-1px] box-border caret-transparent leading-5 w-full border border-gray-200 px-3 py-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          )}

          <div className="box-border caret-transparent mb-4">
            <label className="text-gray-800 text-sm font-bold box-border caret-transparent block leading-5 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="text-gray-800 shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_1px_3px_0px,rgba(0,0,0,0.1)_0px_1px_2px_-1px] box-border caret-transparent leading-5 w-full border border-gray-200 px-3 py-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div className="box-border caret-transparent mb-4">
            <label className="text-gray-800 text-sm font-bold box-border caret-transparent block leading-5 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="text-gray-800 shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_1px_3px_0px,rgba(0,0,0,0.1)_0px_1px_2px_-1px] box-border caret-transparent leading-5 w-full border border-gray-200 px-3 py-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {!isLogin && (
            <div className="box-border caret-transparent mb-6">
              <label className="text-gray-800 text-sm font-bold box-border caret-transparent block leading-5 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="text-gray-800 shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_1px_3px_0px,rgba(0,0,0,0.1)_0px_1px_2px_-1px] box-border caret-transparent leading-5 w-full border border-gray-200 px-3 py-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          )}

          <div className="items-center box-border caret-transparent flex justify-between">
            <button
              type="submit"
              disabled={isLoading}
              className="text-white font-bold bg-slate-600 hover:bg-slate-700 caret-transparent block text-center px-4 py-2 rounded-bl rounded-br rounded-tl rounded-tr transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (isLogin ? "Signing In..." : "Signing Up...") : (isLogin ? "Sign In" : "Sign Up")}
            </button>
            {isLogin && (
              <a
                href="/forgot-password"
                className="text-emerald-500 text-sm font-bold box-border caret-transparent block leading-5 hover:text-emerald-600"
              >
                Forgot Password?
              </a>
            )}
          </div>
        </form>

        {isLogin && (
          <p className="text-gray-800 text-sm box-border caret-transparent leading-5 text-center mt-4">
            Don't have an account?{" "}
            <button
              onClick={() => setIsLogin(false)}
              className="text-emerald-500 box-border caret-transparent hover:text-emerald-600"
            >
              Register
            </button>
          </p>
        )}
      </div>

      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-center">Verify Your Email</h3>
            <p className="text-gray-600 mb-4 text-center">
              Enter the 6-digit OTP sent to your email
            </p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full text-center text-2xl font-bold border border-gray-300 rounded-lg px-4 py-3 mb-4"
              maxLength={6}
            />
            <div className="flex gap-2">
              <button
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.length !== 6}
                className="flex-1 bg-slate-600 text-white py-2 rounded-lg disabled:bg-gray-400"
              >
                {isLoading ? "Verifying..." : "Verify"}
              </button>
              <button
                onClick={handleResendOtp}
                disabled={isLoading}
                className="flex-1 bg-emerald-500 text-white py-2 rounded-lg disabled:bg-gray-400"
              >
                Resend OTP
              </button>
            </div>
            <button
              onClick={() => setShowOtpModal(false)}
              className="w-full mt-4 text-gray-500 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};