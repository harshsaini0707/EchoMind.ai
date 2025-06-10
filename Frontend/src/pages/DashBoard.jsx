import React, { useState, useEffect } from 'react';
import { Play, Upload, Languages, Zap, FileText, Clock, Shield, Star, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const DashBoard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  // Auto-cycle through steps for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      icon: Upload,
      title: "Upload Your Audio",
      description: "Drag & drop or select audio files in any format. We support MP3, WAV, M4A, and more.",
      color: "bg-blue-500"
    },
    {
      icon: Languages,
      title: "Choose Language",
      description: "Select source and target languages from our 100+ supported languages for transcription and translation.",
      color: "bg-purple-500"
    },
    {
      icon: Zap,
      title: "AI Processing",
      description: "Our advanced AI transcribes, translates, and summarizes your content with 98%+ accuracy in minutes.",
      color: "bg-blue-600"
    },
    {
      icon: FileText,
      title: "Get Results",
      description: "Download transcripts, translations, and summaries in multiple formats (TXT, DOCX, PDF, SRT).",
      color: "bg-blue-500"
    }
  ];

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process hours of audio in minutes with our optimized AI models",
      color: "bg-orange-500"
    },
    {
      icon: Languages,
      title: "100+ Languages",
      description: "Transcribe and translate in over 100 languages with native accuracy",
      color: "bg-purple-500"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Secured with 2-factor Authentication",
      color: "bg-green-500"
    },
    {
      icon: FileText,
      title: "Smart Summaries",
      description: "AI-generated summaries, key points, and action items from your content",
      color: "bg-pink-500"
    },
    {
      icon: Clock,
      title: "Real-time Processing",
      description: "Live transcription and translation for meetings, calls, and events",
      color: "bg-red-500"
    },
    {
      icon: Star,
      title: "98% Accuracy",
      description: "Industry-leading accuracy with continuous learning and improvement",
      color: "bg-blue-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold text-slate-800">EchoMind.ai</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#feature" className="text-slate-600 hover:text-slate-900 transition-colors">Features</a>
              <a href="#work" className="text-slate-600 hover:text-slate-900 transition-colors">How It Works</a>
              <button onClick={()=>navigate("/signup")} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                Signup
              </button>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 animate-fadeIn">
          <div className="px-4 py-2 space-y-2">
            <a href="#feature" className="block px-3 py-2 text-slate-600 hover:text-slate-900">Features</a>
            <a href="#work" className="block px-3 py-2 text-slate-600 hover:text-slate-900">How It Works</a>
      
            <button  onClick={()=>navigate("/signup")} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg mt-2">
             Signup
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  Transcribe,<br />
                  Translate &<br />
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Summarize
                  </span>
                  Your<br />
                  Audio Instantly
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                  AI-powered accuracy, multilingual support, and lightning-fast results. Transform your voice into powerful text-based insights with cutting-edge AI technology.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                onClick={()=>navigate("/Signup")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                 Start The Journey
                </button>
                <button className="flex items-center justify-center space-x-2 border-2 border-blue-500 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all">
                  <Play size={20} />
                  <span>See Demo</span>
                </button>
              </div>
            </div>

            {/* Audio Processing Demo */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-500">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-800">Audio Processing</h3>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                
                {/* Audio Waveform */}
                <div className="flex items-center space-x-1 h-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-t from-blue-500 to-purple-600 rounded-full animate-pulse"
                      style={{
                        width: '3px',
                        height: `${Math.random() * 80 + 20}%`,
                        animationDelay: `${i * 50}ms`
                      }}
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Upload size={16} />
                    <span>podcast_interview.mp3 uploaded</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Languages size={16} />
                    <span>Detected: English → Hindi</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <FileText size={16} />
                    <span>Transcription: 98.5% accuracy</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-700 italic">
                    "आज के पॉडकास्ट में आपका स्वागत है, जहाँ हम आर्टिफिशियल इंटेलिजेंस के भविष्य के बारे में बात करेंगे।"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="work" className="py-20 bg-white" >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600">Transform your audio content in just four simple steps</p>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl border-l-4 ${
                  activeStep === index ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200'
                } transition-all duration-500 transform hover:-translate-y-1`}
              >
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center shadow-lg ${
                      activeStep === index ? 'animate-pulse scale-110' : ''
                    } transition-transform`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-full border-4 border-white flex items-center justify-center text-lg font-bold shadow-lg ${
                    activeStep === index ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
     <section id="feature" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-slate-900 mb-4">
        Powerful Features for Every Need
      </h2>
      <p className="text-xl text-slate-600">
        Everything you need to transform voice into actionable insights
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div
              className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center shadow-lg`}
            >
              <feature.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900">
              {feature.title}
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Audio?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join EchoMind.ai for their audio processing needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={()=>navigate("/login")} className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg">
              Login
            </button>
         
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div >
            <div className='justify-center'>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">E</span>
                </div>
                <span className="text-lg font-bold">EchoMind.ai</span>
              </div>
              <p className="text-slate-400">
                Transform your voice into powerful insights with AI-powered transcription and translation.
              </p>
            </div>
         
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 EchoMind.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashBoard;