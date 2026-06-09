import { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { ShieldCheck, Mail, ArrowRight, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react'


// ==========================================
// 1. THREE.JS / SHADER COMPONENT
// ==========================================

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform vec2 uResolution;
  varying vec2 vUv;

  void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    vec2 aspectCorrectedSt = st;
    aspectCorrectedSt.x *= (uResolution.x / uResolution.y);

    // Grid details
    float gridSize = 32.0;
    vec2 gridSt = aspectCorrectedSt * gridSize;
    vec2 ipos = floor(gridSt);
    vec2 fpos = fract(gridSt) - 0.5;

    float distToDot = length(fpos);

    // Wave pattern from center
    vec2 center = vec2(0.5 * (uResolution.x / uResolution.y), 0.5);
    float distToCenter = length(aspectCorrectedSt - center);

    // Wave propagation based on progress
    // Forward: progress goes 0.0 -> 1.0. Dot opacity scales in.
    // Reverse: progress goes 1.0 -> 0.0. Dot opacity scales out.
    float wave = smoothstep(uProgress - 0.2, uProgress, 1.0 - distToCenter * 0.7);

    // Dot size modulation
    float dotRadius = 0.06 * wave;
    float dotMask = step(distToDot, dotRadius);

    // Color: teal #0FA884, moving towards indigo/purple accent
    vec3 color = mix(vec3(0.06, 0.66, 0.52), vec3(0.42, 0.36, 0.96), distToCenter);

    float alpha = dotMask * wave * 0.35;

    gl_FragColor = vec4(color * wave, alpha);
  }
`

function ShaderBackground({ progress }: { progress: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { size } = useThree()

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height)
    }
  }, [size])

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime()
      // Smoothly interpolate the progress uniform
      materialRef.current.uniforms.uProgress.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uProgress.value,
        progress,
        0.08
      )
    }
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        }}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  )
}

function CanvasRevealEffect({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 z-0 bg-black">
      <Canvas camera={{ position: [0, 0, 1] }} gl={{ antialias: true }}>
        <ShaderBackground progress={progress} />
      </Canvas>
    </div>
  )
}

// ==========================================
// 2. MINI NAVBAR COMPONENT
// ==========================================

function MiniNavbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-between px-6 py-3 border border-white/10 backdrop-blur-xl bg-black/40 transition-all duration-500 ${
        scrolled ? 'w-[320px] rounded-xl' : 'w-[90%] max-w-4xl rounded-full'
      }`}
      layout
    >
      <Link to="/" className="font-syne font-bold text-white text-sm tracking-wider hover:opacity-80 transition-opacity">
        TeachFlow AI
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/" className="font-sans text-xs text-white/75 hover:text-white transition-colors">
          Back to Home
        </Link>
        <Link to="/contact" className="font-sans text-xs text-white/75 hover:text-white transition-colors">
          Contact
        </Link>
      </div>
    </motion.nav>
  )
}

// ==========================================
// 3. MAIN SIGN-IN COMPONENT
// ==========================================

export function SignInPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2 | 3>(1) // 1: Email, 2: OTP Code, 3: Success
  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState<string[]>(Array(6).fill(''))
  const [canvasProgress, setCanvasProgress] = useState(0) // 0 to 1 for shader reveal
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [codeError, setCodeError] = useState('')
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  // Trigger forward canvas dots reveal on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanvasProgress(1.0) // Reveal dots
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  // Handle email OTP generation
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError(null)
    setCodeError('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: window.location.origin + '/discover'
        }
      })

      if (error) throw error

      setStep(2)
      // Focus first input of OTP
      setTimeout(() => {
        otpRefs.current[0]?.focus()
      }, 300)
    } catch (err: any) {
      console.error("OTP send error:", err)
      setError(err.message || "Failed to send code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle OTP digit changes
  const handleOtpChange = (index: number, val: string) => {
    if (isNaN(Number(val)) && val !== '') return
    const newOtp = [...otpCode]
    newOtp[index] = val.substring(val.length - 1)
    setOtpCode(newOtp)

    if (val !== '' && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const newOtp = [...otpCode]
      newOtp[index - 1] = ''
      setOtpCode(newOtp)
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    if (pastedData.length === 6 && !isNaN(Number(pastedData))) {
      const newOtp = pastedData.split('')
      setOtpCode(newOtp)
      otpRefs.current[5]?.focus()
    }
  }

  // Trigger verify once code is fully entered
  useEffect(() => {
    const codeString = otpCode.join('')
    if (codeString.length === 6 && step === 2) {
      handleVerifyOtp()
    }
  }, [otpCode])

  // Verify OTP
  const handleVerifyOtp = async () => {
    setLoading(true)
    setError(null)
    setCodeError('')
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otpCode.join(''),
        type: 'email'
      })
      if (data.session) {
        navigate('/discover')
      }
      if (error) {
        // Show inline error below code input
        setCodeError('Invalid or expired code. Please try again.')
        setOtpCode(Array(6).fill(''))
        otpRefs.current[0]?.focus()
      }
    } catch (err: any) {
      console.error("OTP verification error:", err)
      setCodeError('Invalid or expired code. Please try again.')
      setOtpCode(Array(6).fill(''))
      otpRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden font-sans">
      {/* 3D Canvas Background */}
      <CanvasRevealEffect progress={canvasProgress} />

      {/* Mini Top Navbar */}
      <MiniNavbar />

      {/* Auth Card Container */}
      <div className="relative z-10 w-full max-w-md px-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full bg-black/60 border border-white/10 backdrop-blur-2xl rounded-2xl p-8 text-white shadow-2xl"
            >
              <div className="text-center mb-8">
                <span className="font-syne text-[10px] tracking-[0.2em] text-accentTeal uppercase font-semibold">
                  Synora Intel Secure Auth
                </span>
                <h1 className="font-playfair text-3xl font-bold mt-2 text-white">
                  Welcome to TeachFlow AI
                </h1>
                <p className="font-sans text-xs text-white/50 mt-1">
                  Less Searching. More Teaching.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-950/40 border border-red-500/20 text-red-200 text-xs rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="relative">
                  <label htmlFor="email" className="block text-[10px] font-syne uppercase tracking-wider text-white/40 mb-1.5">
                    Enter your email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="teacher@school.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accentTeal focus:ring-1 focus:ring-accentTeal transition-all placeholder:text-white/20 text-white"
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full py-3 bg-white hover:bg-white/90 text-black font-syne font-semibold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:hover:bg-white"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Send Sign-In Link <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="otp-step"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full bg-black/60 border border-white/10 backdrop-blur-2xl rounded-2xl p-8 text-white shadow-2xl"
            >
              <div className="mb-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              </div>

              <div className="text-center mb-8">
                <ShieldCheck className="w-10 h-10 text-accentTeal mx-auto mb-2" />
                <h2 className="font-playfair text-2xl font-bold text-white">
                  Enter Secure Code
                </h2>
                <p className="font-sans text-xs text-white/50 mt-1.5">
                  We've sent a 6-digit verification code to <br />
                  <span className="text-white font-medium">{email}</span>
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-950/40 border border-red-500/20 text-red-200 text-xs rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-6">
                <div className="flex justify-between gap-2">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpRefs.current[idx] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      className="w-12 h-14 text-center bg-white/5 border border-white/10 rounded-xl text-lg font-semibold focus:outline-none focus:border-accentTeal focus:ring-1 focus:ring-accentTeal transition-all text-white"
                      disabled={loading}
                    />
                  ))}
                </div>
                {codeError && (
                  <p className="text-red-400 text-sm text-center mt-2">{codeError}</p>
                )}

                <div className="text-center">
                  <button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="text-[11px] font-syne uppercase tracking-wider text-accentTeal hover:underline transition-all disabled:opacity-50"
                  >
                    Resend verification code
                  </button>
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otpCode.some(c => c === '')}
                  className="w-full py-3 bg-white hover:bg-white/90 text-black font-syne font-semibold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    "Verify & Sign In"
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="success-step"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full bg-black/60 border border-white/10 backdrop-blur-2xl rounded-2xl p-8 text-white shadow-2xl text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-16 h-16 bg-accentTeal/20 border border-accentTeal/30 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <ShieldCheck className="w-8 h-8 text-accentTeal" />
              </motion.div>

              <h2 className="font-playfair text-3xl font-bold text-white mb-2">
                Access Granted
              </h2>
              <p className="font-sans text-xs text-white/50 max-w-[280px] mx-auto mb-8">
                Your credentials have been securely verified. Welcome to your Discovery Workspace.
              </p>

              <button
                onClick={() => navigate('/discover')}
                className="w-full py-3 bg-accentTeal hover:bg-accentTeal/90 text-white font-syne font-semibold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-accentTeal/20"
              >
                Continue to Discovery <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
export default SignInPage
