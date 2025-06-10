import React, { useRef, useState ,useEffect } from 'react';
import { useSelector } from 'react-redux'
import {
  Upload, Play, Pause, Download, FileAudio, Trash2, Volume2
} from 'lucide-react';
import MainMenu from './MainMenu';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AudioSummary = () => {
    const navigate = useNavigate();
  const user = useSelector((store)=>store?.user);



useEffect(() => {
  if (!user) navigate("/login");
}, [user, navigate]);

  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [customLanguage, setCustomLanguage] = useState('');
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);
  

  const Summary = async () => {
    if (!audioFile) return;

    setLoading(true);
    setSummary('');

    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      const language = selectedLanguage === 'custom' ? customLanguage : selectedLanguage;
      formData.append('language', language);

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/audio/summary`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials:true
      });

      setSummary(response.data.summary);
    } catch (error) {
      if (error?.response?.status === 401) {
        return navigate("/login");
      } else {
        console.error("Upload failed:", error);
        alert("Failed to transcribe audio.");
      }

      setSummary('Failed to generate summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const languages = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'Arabic', label: 'Arabic' },
];

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
      setSummary('');
    }
  };

  const handleUpload = (e) => handleFileSelect(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const clearAll = () => {
    setAudioFile(null);
    setAudioUrl('');
    setIsPlaying(false);
    setSummary('');
    setCustomLanguage('');
    fileInputRef.current.value = '';
  };

  const downloadSummary = () => {
    const file = new Blob([summary], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = 'summary.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MainMenu>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white">Audio Summarizer</h2>
          <p className="text-gray-300 mt-2">Upload an audio file to generate a quick summary</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload & Player */}
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <Upload className="mr-2" size={20} /> Upload Audio
            </h3>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-400 hover:border-purple-400 hover:bg-purple-400/5 rounded-xl text-center p-6 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileAudio className="mx-auto mb-4 text-gray-400" size={40} />
              <p className="text-gray-300 mb-2">Drag & drop or click to upload</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Browse Files
              </button>
              <p className="text-xs text-gray-400 mt-2">Supports MP3, WAV, M4A</p>
            </div>

            {audioFile && (
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center text-white">
                  <div className="flex items-center gap-2">
                    <Volume2 size={18} className="text-purple-400" />
                    <span>{audioFile.name}</span>
                  </div>
                  <button onClick={clearAll} className="text-red-400 hover:text-red-300">
                    <Trash2 size={18} />
                  </button>
                </div>

                <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
                <button
                  onClick={togglePlay}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>

                <div className="mt-4">
                  <label className="block text-sm text-white mb-1">Choose Language:</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full bg-white/10 text-white border border-white/20 px-4 py-2 rounded-lg focus:outline-none"
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value} className="text-black">
                        {lang.label}
                      </option>
                    ))}
                    <option value="custom" className="text-black">
                      Custom...
                    </option>
                  </select>

                  {selectedLanguage === 'custom' && (
                    <input
                      type="text"
                      placeholder="Enter language code (e.g., ta for Tamil)"
                      value={customLanguage}
                      onChange={(e) => setCustomLanguage(e.target.value)}
                      className="mt-2 w-full bg-white/10 text-white border border-white/20 px-4 py-2 rounded-lg focus:outline-none"
                    />
                  )}
                </div>

                <button
                  onClick={Summary}
                  disabled={loading || !audioFile || (selectedLanguage === 'custom' && !customLanguage)}
                  className="w-full mt-6 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg hover:from-green-600 hover:to-blue-600 disabled:opacity-50"
                >
                  {loading ? 'Summarizing...' : 'Generate Summary'}
                </button>
              </div>
            )}
          </div>

          {/* Summary Box */}
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold flex items-center">
                <FileAudio className="mr-2" size={20} /> Summary
              </h3>
              {summary && (
                <button
                  onClick={downloadSummary}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 flex items-center"
                >
                  <Download className="mr-1" size={16} />
                  Download
                </button>
              )}
            </div>

            <div
            style={{ lineHeight: '2' }} 
            className="bg-white/5 rounded-lg p-4 h-100 font-bold shadow-none  overflow-y-auto text-gray-200 whitespace-pre-wrap">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-spin h-10 w-10 border-2 border-purple-400 rounded-full border-b-transparent mb-4" />
                  <p className="text-gray-300">Generating summary...</p>
                </div>
              ) : summary ? (
                summary
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <FileAudio size={44} className="mb-2 opacity-50" />
                  <p>Upload an audio file to generate summary</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainMenu>
  );
};

export default AudioSummary;
