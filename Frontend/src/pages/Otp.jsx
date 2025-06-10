import React, { useState, useEffect } from 'react'
import { ShieldCheck, Mail, RefreshCw } from 'lucide-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Otp = () => {
  
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(60) 
  const [resendLoading, setResendLoading] = useState(false)
  const email = useSelector((store) => store?.user?.email) || ""

  useEffect(() => {
    if(!email) return navigate("/login"); 
    let timer
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [resendTimer])

  const handleVerify = async () => {
    if (!otp.trim()) {
      setError('OTP is required')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      

      const response = await axios.post(
        import.meta.env.VITE_BASE_URL + '/auth/verify-otp',
        { email , otp },
        { withCredentials: true }
      )

      console.log('Verification success:', response.data)
      navigate('/audio-to-text') 
    } catch (err) {
      console.error('OTP verification error:', err)
      setError(err.response?.data?.message || 'Invalid or expired OTP.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setResendLoading(true)
    setError('')

    try {
      await axios.post(
        import.meta.env.VITE_BASE_URL + '/auth/resend-otp',
        {},
        { withCredentials: true }
      )

      setResendTimer(60) 
    } catch (err) {
      console.error('Resend OTP error:', err)
      setError('Failed to resend OTP. Please try again later.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-gray-200 to-blue-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4 shadow-lg">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h1>
          <p className="text-gray-600">Enter the OTP sent to your email</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                OTP
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleVerify}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify OTP'
              )}
            </button>

            <div className="text-center mt-4">
              {resendTimer > 0 ? (
                <p className="text-sm text-gray-600">
                  Resend OTP in{' '}
                  <span className="font-medium text-blue-600">00:{resendTimer}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={resendLoading}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4 animate-spin-slow" />
                  {resendLoading ? 'Resending...' : 'Resend OTP'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Otp