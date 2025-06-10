import React, { useRef, useState , useEffect } from 'react';
import {
  Upload, Play, Pause, Download, FileAudio, Trash2, Volume2
} from 'lucide-react';
import MainMenu from './MainMenu';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
const languages = [
  { label: 'English (en)', value: 'en' },
  { label: 'Hindi (hi)', value: 'hi' },
  { label: 'Spanish (es)', value: 'es' },
  { label: 'French (fr)', value: 'fr' },
  { label: 'German (de)', value: 'de' },
  { label: 'Custom... Use Language Code like for (hindi) - hi', value: 'custom' },
];

const AudioConverter = () => {

    const navigate = useNavigate();
  const user = useSelector((store)=>store?.user);



useEffect(() => {
  if (!user) navigate("/login");
}, [user, navigate]);

  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [convertedAudioUrl, setConvertedAudioUrl] = useState('');
  const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
  const [isPlayingConverted, setIsPlayingConverted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [customLanguage, setCustomLanguage] = useState('');
  const fileInputRef = useRef(null);
  const originalAudioRef = useRef(null);
  const convertedAudioRef = useRef(null);


const convertAudioAPI = async () => {
  if (!audioFile) return;

  setLoading(true);
  setConvertedAudioUrl('');
  setIsPlayingConverted(false);

  const formData = new FormData();
  formData.append('audio', audioFile);
  formData.append('language', effectiveLanguage); // e.g. 'en', 'hi'

 const backendOrigin = process.meta.env.VITE_BASE_URL;

try {
  const response = await axios.post(
    `${process.meta.env.VITE_BASE_URL}/audio/audio-to-audio`,
    formData,
    { withCredentials: true }
  );

  console.log(response.data.translatedAudioUrl);

  if (response.data.translatedAudioUrl) {
    // Fix relative URL by adding backend origin if needed
    let audioUrl = response.data.translatedAudioUrl;

    if (audioUrl.startsWith('/')) {
      audioUrl = backendOrigin + audioUrl;
    }

    setConvertedAudioUrl(audioUrl);
  } else {
    throw new Error('No audio URL returned');
  }
} catch (error) {
if (error?.response?.status === 401) {
        return navigate("/login");
      } else {
        console.error("Upload failed:", error);
        alert("Failed to transcribe audio.");
      }
}
 finally {
    setLoading(false);
  }
};


  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
      setConvertedAudioUrl('');
      setIsPlayingOriginal(false);
      setIsPlayingConverted(false);
    }
  };

  const handleUpload = (e) => handleFileSelect(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const togglePlayOriginal = () => {
    if (!originalAudioRef.current) return;
    if (isPlayingOriginal) {
      originalAudioRef.current.pause();
    } else {
      originalAudioRef.current.play();
    }
    setIsPlayingOriginal(!isPlayingOriginal);
  };

  const togglePlayConverted = () => {
    if (!convertedAudioRef.current) return;
    if (isPlayingConverted) {
      convertedAudioRef.current.pause();
    } else {
      convertedAudioRef.current.play();
    }
    setIsPlayingConverted(!isPlayingConverted);
  };

  // Simulate conversion process — replace this with your API call
  const simulateConversion = () => {
    if (!audioFile) return;
    setLoading(true);
    setConvertedAudioUrl('');
    setIsPlayingConverted(false);

    // Simulate delay for conversion
    setTimeout(() => {
      // For demo, just reuse the original audio URL as "converted"
      // In real app, get converted audio URL from backend
      setConvertedAudioUrl(audioUrl);
      setLoading(false);
    }, 3000);
  };

  const clearAll = () => {
    setAudioFile(null);
    setAudioUrl('');
    setConvertedAudioUrl('');
    setIsPlayingOriginal(false);
    setIsPlayingConverted(false);
    setSelectedLanguage('en');
    setCustomLanguage('');
    fileInputRef.current.value = '';
  };

  const downloadConvertedAudio = () => {
    if (!convertedAudioUrl) return;
    const a = document.createElement('a');
    a.href = convertedAudioUrl;
    a.download = `converted_${audioFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const effectiveLanguage = selectedLanguage === 'custom' ? customLanguage.trim() : selectedLanguage;

  return (
    <MainMenu>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white">Audio to Audio Converter</h2>
          <p className="text-gray-300 mt-2">Upload an audio file and convert it to another language or format</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload & Original Audio Player */}
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <Upload className="mr-2" size={20} /> Upload Audio
            </h3>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-400 hover:border-purple-400 hover:bg-purple-400/5 rounded-xl text-center p-6"
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
              <>
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

                  <audio
                    ref={originalAudioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlayingOriginal(false)}
                  />
                  <button
                    onClick={togglePlayOriginal}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full"
                  >
                    {isPlayingOriginal ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                </div>

                {/* Language Selection */}
                <div className="mt-6">
                  <label className="block text-sm text-white mb-1">Convert To Language:</label>
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

                {/* Convert Button */}
                <button
                  onClick={convertAudioAPI}
                  disabled={loading}
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg hover:from-green-600 hover:to-blue-600 disabled:opacity-50"
                >
                  {loading ? 'Converting...' : 'Convert Audio'}
                </button>
              </>
            )}
          </div>

          {/* Converted Audio Player & Download */}
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold flex items-center">
                <FileAudio className="mr-2" size={20} /> Converted Audio
              </h3>
              {convertedAudioUrl && (
                <button
                  onClick={downloadConvertedAudio}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 flex items-center"
                >
                  <Download className="mr-1" size={16} />
                  Download
                </button>
              )}
            </div>

            <div className="flex flex-col items-center justify-center h-96">
              {loading && (
                <div className="flex flex-col items-center">
                  <div className="animate-spin h-10 w-10 border-2 border-purple-400 rounded-full border-b-transparent mb-4" />
                  <p className="text-gray-300">Processing audio...</p>
                </div>
              )}

              {!loading && convertedAudioUrl ? (
                <>
                  <audio
                    ref={convertedAudioRef}
                    src={convertedAudioUrl}
                    onEnded={() => setIsPlayingConverted(false)}
                    controls
                  />
                  <button
                    onClick={togglePlayConverted}
                    className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full"
                  >
                    {isPlayingConverted ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                </>
              ) : (
                !loading && (
                  <div className="text-gray-400 text-center">
                    <FileAudio size={44} className="mb-2 opacity-50 mx-auto" />
                    <p>Converted audio will appear here</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </MainMenu>
  );
};

export default AudioConverter;
