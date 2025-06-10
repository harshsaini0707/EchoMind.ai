import React, { useState, useRef } from 'react';
import {
  FileText,
  Text,
  Repeat,
  Upload,
  Play,
  Pause,
  Download,
  Languages,
  Loader2,
  CheckCircle,
  X,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Menu = () => {
  const [activeTab, setActiveTab] = useState('audio-to-text');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [customLanguage, setCustomLanguage] = useState('');
  const [result, setResult] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);
  const navigate = useNavigate();


  const AudioToText = async()=>{
    try {

      const res = await axios.post(import.meta.env.VITE_BASE_URL+"/audio/upload",{
selectedLanguage , fileInputRef
      })
      
    } catch (error) {
      if(error?.res?.status === 401) return navigate("/login")
    }
  }

  const commonLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/mp4', 'audio/webm'];
      if (validTypes.includes(file.type) || file.name.match(/\.(mp3|wav|m4a|mp4|webm)$/i)) {
        setUploadedFile(file);
        setResult('');
        setShowLanguageModal(true);
      } else {
        alert('Please upload a valid audio file (MP3, WAV, M4A, MP4, WEBM)');
      }
    }
  };

  const handleLanguageSelection = () => {
    const language = customLanguage.trim() || selectedLanguage;
    if (!language) {
      alert('Please select or enter a language');
      return;
    }
    
    setShowLanguageModal(false);
    processAudio(language);
  };

  const processAudio = async (language) => {
    setIsProcessing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock results based on active tab
    let mockResult = '';
    switch (activeTab) {
      case 'audio-to-text':
        mockResult = `[Transcribed in ${language}]\n\nHello, this is a sample transcription of your audio file. The AI has successfully converted your speech to text with high accuracy. This transcription includes proper punctuation, capitalization, and formatting to make it easy to read and understand.\n\nKey features of this transcription:\n- High accuracy speech recognition\n- Automatic punctuation\n- Speaker identification (if multiple speakers)\n- Timestamp markers available on request\n\nThe transcription process took into account the selected language (${language}) to ensure optimal accuracy for your specific audio content.`;
        break;
      case 'audio-summary':
        mockResult = `[Audio Summary - Language: ${language}]\n\n📋 EXECUTIVE SUMMARY:\nThis audio file contains important discussion points about project management and team coordination.\n\n🔑 KEY POINTS:\n• Project timeline discussed with milestone dates\n• Budget allocation for Q4 reviewed\n• Team responsibilities and assignments clarified\n• Risk assessment and mitigation strategies outlined\n\n📝 ACTION ITEMS:\n• Follow up on budget approval by Friday\n• Schedule team meeting for next week\n• Prepare risk assessment report\n• Update project timeline documentation\n\n⏱️ DURATION: Approximately ${Math.ceil(Math.random() * 30 + 10)} minutes\n📊 CONFIDENCE SCORE: 94%`;
        break;
      case 'audio-translate':
        mockResult = `[Audio Translation Complete]\n\nSource Language: Auto-detected\nTarget Language: ${language}\n\n🎯 TRANSLATION STATUS: SUCCESS\n\nYour audio has been successfully translated to ${language} while preserving:\n• Original speaker's tone and emotion\n• Natural speech rhythm and pacing\n• Voice characteristics and style\n• Background audio elements\n\n🔊 TRANSLATED AUDIO READY\nGenerated: translated_audio_${Date.now()}.wav\nDuration: ${Math.ceil(Math.random() * 30 + 10)} minutes\nQuality: Premium (48kHz, 16-bit)\n\n📊 PROCESSING DETAILS:\n• Voice cloning accuracy: 94%\n• Translation accuracy: 97%\n• Audio quality score: 96%\n• Processing time: 4.7 seconds\n\n🎵 The translated audio maintains natural speech patterns and can be downloaded below.`;
        break;
    }
    
    setResult(mockResult);
    setIsProcessing(false);
  };

  const toggleAudioPlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const downloadResult = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `echomind-${activeTab}-result.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetProcess = () => {
    setUploadedFile(null);
    setResult('');
    setSelectedLanguage('');
    setCustomLanguage('');
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const menuItems = [
    {
      id: 'audio-to-text',
      title: 'Audio to Text',
      icon: Text,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      hoverColor: 'hover:bg-blue-500/20'
    },
    {
      id: 'audio-summary',
      title: 'Audio Summary',
      icon: FileText,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      hoverColor: 'hover:bg-green-500/20'
    },
    {
      id: 'audio-translate',
      title: 'Audio Translation',
      icon: Repeat,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      hoverColor: 'hover:bg-purple-500/20'
    }
  ];

  const getButtonColor = () => {
    switch (activeTab) {
      case 'audio-to-text': return 'bg-blue-600 hover:bg-blue-700';
      case 'audio-summary': return 'bg-green-600 hover:bg-green-700';
      case 'audio-translate': return 'bg-purple-600 hover:bg-purple-700';
      default: return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  const renderContent = () => {
    const buttonColorClass = getButtonColor();
    
    return (
      <section className="space-y-8 text-white">
        <header>
          <h2 className="text-3xl font-bold mb-2">
            {activeTab === 'audio-to-text' && 'Audio to Text Transcription'}
            {activeTab === 'audio-summary' && 'Audio Summary Generator'}
            {activeTab === 'audio-translate' && 'Audio Translation Service'}
          </h2>
          <p className="text-slate-300">
            {activeTab === 'audio-to-text' && 'Convert audio to accurate, searchable text using AI.'}
            {activeTab === 'audio-summary' && 'Generate smart summaries from your audio content instantly.'}
            {activeTab === 'audio-translate' && 'Translate audio across 50+ languages with natural voice generation.'}
          </p>
        </header>

        {/* Upload Area */}
        {!uploadedFile && !result && (
          <div className="bg-white/5 rounded-xl p-8 border border-white/10 text-center space-y-6">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${
              activeTab === 'audio-to-text' ? 'bg-blue-500/20' :
              activeTab === 'audio-summary' ? 'bg-green-500/20' : 'bg-purple-500/20'
            }`}>
              <Upload className={`w-12 h-12 ${
                activeTab === 'audio-to-text' ? 'text-blue-400' :
                activeTab === 'audio-summary' ? 'text-green-400' : 'text-purple-400'
              }`} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Upload Audio File</h3>
              <p className="text-slate-400 mb-6">
                Supports MP3, WAV, M4A, MP4, WEBM • Max size: 100MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,.mp3,.wav,.m4a,.mp4,.webm"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`px-8 py-3 ${buttonColorClass} rounded-lg font-medium text-white transition-colors`}
            >
              Choose Audio File
            </button>
          </div>
        )}

        {/* File Preview */}
        {uploadedFile && !result && !isProcessing && (
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white">{uploadedFile.name}</h4>
                  <p className="text-sm text-slate-400">
                    {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={resetProcess}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            {uploadedFile && (
              <div className="mb-4">
                <audio
                  ref={audioRef}
                  src={URL.createObjectURL(uploadedFile)}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
                <button
                  onClick={toggleAudioPlayback}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span className="text-sm">{isPlaying ? 'Pause' : 'Preview'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="bg-white/5 rounded-xl p-8 border border-white/10 text-center space-y-4">
            <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto" />
            <h3 className="text-xl font-semibold">Processing Audio...</h3>
            <p className="text-slate-400">
              {activeTab === 'audio-to-text' && 'Transcribing your audio to text...'}
              {activeTab === 'audio-summary' && 'Analyzing and summarizing content...'}
              {activeTab === 'audio-translate' && 'Translating audio content...'}
            </p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-semibold">Processing Complete</h3>
              </div>
              <div className="flex space-x-2">
                {activeTab === 'audio-translate' ? (
                  <button
                    onClick={() => {
                      // Mock download of translated audio file
                      const link = document.createElement('a');
                      link.href = '#';
                      link.download = `translated_audio_${selectedLanguage || customLanguage}_${Date.now()}.wav`;
                      alert(`Downloading translated audio file: ${link.download}`);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Audio</span>
                  </button>
                ) : (
                  <button
                    onClick={downloadResult}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                )}
                <button
                  onClick={resetProcess}
                  className={`px-4 py-2 ${buttonColorClass} rounded-lg font-medium transition-colors`}
                >
                  Process New File
                </button>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <pre className="whitespace-pre-wrap text-sm text-slate-200 leading-relaxed">
                {result}
              </pre>
              
              {/* Audio Translation Preview */}
              {activeTab === 'audio-translate' && (
                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-white">Translated Audio Preview</h4>
                    <span className="text-xs text-slate-400">Premium Quality</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => alert('Playing translated audio preview...')}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      <span>Play Translated Audio</span>
                    </button>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{width: '0%'}}></div>
                    </div>
                    <span className="text-sm text-slate-400">0:00 / 2:34</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    );
  };

  return (
    <>
      <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Sidebar */}
        <aside className="w-72 bg-black/30 backdrop-blur border-r border-white/10 flex flex-col">
          <div className="p-6 border-b border-white/10">
            <h1 className="text-2xl font-bold text-white">EchoMind</h1>
            <p className="text-xs text-slate-400">AI Audio Intelligence</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map(({ id, title, icon: Icon, color, bgColor, hoverColor }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id);
                    resetProcess();
                  }}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
                    isActive ? `${bgColor} border border-white/10 shadow` : `hover:bg-white/5 ${hoverColor}`
                  }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${bgColor}`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {title}
                  </span>
                </button>
              );
            })}
          </nav>

          <footer className="p-4 border-t border-white/10 text-center text-xs text-slate-500">
            EchoMind v1.0
          </footer>
        </aside>

        {/* Main Panel */}
        <main className="flex-1 overflow-auto p-8">
          {renderContent()}
        </main>
      </div>

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-white/20 rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Languages className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Select Language</h3>
                  <p className="text-sm text-slate-400">Choose the language of your audio</p>
                </div>
              </div>
              <button
                onClick={() => setShowLanguageModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Common Languages
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {commonLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang.name)}
                      className={`p-3 text-left rounded-lg border transition-colors ${
                        selectedLanguage === lang.name
                          ? 'bg-blue-500/20 border-blue-500/50 text-white'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="font-medium">{lang.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-800 text-slate-400">or</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Type Custom Language
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={customLanguage}
                    onChange={(e) => {
                      setCustomLanguage(e.target.value);
                      setSelectedLanguage('');
                    }}
                    placeholder="e.g., Tamil, Bengali, Urdu..."
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowLanguageModal(false)}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLanguageSelection}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Process Audio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Menu;