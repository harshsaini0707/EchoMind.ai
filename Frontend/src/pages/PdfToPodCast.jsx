import React, { useRef, useState, useEffect } from 'react';
import {
  Upload, Play, Pause, Download, FileText, Trash2, Volume2, BookOpen
} from 'lucide-react';
import MainMenu from './MainMenu';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const PdfToPodcast = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store?.user);

//   useEffect(() => {
//     if (!user) navigate("/login");
//   }, [user, navigate]);

  const [file, setFile] = useState(null);
  const [audioURL, setAudioURL] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [podcastScript, setPodcastScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [customLanguage, setCustomLanguage] = useState('');
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [paragraphs, setParagraphs] = useState([]);

  const fileInputRef = useRef(null);
  const audioRef = useRef(null);

  // Language options with codes
  const languageOptions = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'te', name: 'Telugu' },
    { code: 'mr', name: 'Marathi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'ur', name: 'Urdu' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'or', name: 'Odia' },
    { code: 'as', name: 'Assamese' },
    { code: 'ne', name: 'Nepali' },
    { code: 'si', name: 'Sinhala' },
    { code: 'my', name: 'Myanmar' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese (Mandarin)' },
    { code: 'ar', name: 'Arabic' },
    { code: 'tr', name: 'Turkish' },
    { code: 'nl', name: 'Dutch' },
    { code: 'sv', name: 'Swedish' },
    { code: 'da', name: 'Danish' },
    { code: 'no', name: 'Norwegian' },
    { code: 'fi', name: 'Finnish' },
    { code: 'pl', name: 'Polish' },
    { code: 'cs', name: 'Czech' },
    { code: 'hu', name: 'Hungarian' },
    { code: 'ro', name: 'Romanian' },
    { code: 'bg', name: 'Bulgarian' },
    { code: 'hr', name: 'Croatian' },
    { code: 'sr', name: 'Serbian' },
    { code: 'sk', name: 'Slovak' },
    { code: 'sl', name: 'Slovenian' },
    { code: 'et', name: 'Estonian' },
    { code: 'lv', name: 'Latvian' },
    { code: 'lt', name: 'Lithuanian' },
    { code: 'mt', name: 'Maltese' },
    { code: 'cy', name: 'Welsh' },
    { code: 'ga', name: 'Irish' },
    { code: 'custom', name: 'Custom Language' }
  ];

  const generatePodcast = async () => {
    if (!file) return alert("Please upload a PDF file.");
    setIsGenerating(true);

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("language", getLanguageCode());
    formData.append("languageName", getLanguageName());

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/pdf/pdfAudio`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

    const { script, audio, languageCode } = response.data;
setPodcastScript(script.map(s => `${s.speaker}: ${s.text}`).join('\n\n'));
setParagraphs(audio); // audio includes audioUrls per paragraph

setAudioURL(audio);
setSelectedLanguage(languageCode || selectedLanguage);

    } catch (error) {
      if (error?.response?.status === 401) {
        return navigate("/login");
      } else {
        console.error("Podcast generation failed:", error);
        alert("Failed to generate podcast from PDF.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected?.type === 'application/pdf') {
      setFile(selected);
      setPodcastScript('');
      setParagraphs([]);
      setCurrentTime(0);
      setDuration(0);
      setCurrentParagraph(0);
      setAudioURL('');
    } else {
      alert('Please select a PDF file.');
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    isPlaying ? audio.pause() : audio.play();
    setIsPlaying(!isPlaying);
  };

  const getLanguageCode = () =>
    selectedLanguage === 'custom' ? customLanguage : selectedLanguage;

  const getLanguageName = () => {
    const lang = languageOptions.find(l => l.code === selectedLanguage);
    return selectedLanguage === 'custom' ? customLanguage : (lang?.name || 'English');
  };

  const downloadPodcast = () => {
    if (!audioURL) return alert("No podcast audio to download.");
    const a = document.createElement('a');
    a.href = audioURL;
    a.download = 'podcast.mp3';
    a.click();
  };

  const downloadScript = () => {
    if (!podcastScript) return alert("No script to download.");
    const blob = new Blob([podcastScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'podcast-script.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (time) =>
    `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, '0')}`;

  // Update current paragraph based on audio time
  useEffect(() => {
    if (paragraphs.length > 0 && duration > 0) {
      const timePerParagraph = duration / paragraphs.length;
      const newParagraph = Math.floor(currentTime / timePerParagraph);
      setCurrentParagraph(Math.min(newParagraph, paragraphs.length - 1));
    }
  }, [currentTime, duration, paragraphs.length]);

  return (
    <MainMenu>
      <div className="max-w-6xl mx-auto p-4 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">PDF to Podcast</h2>
          <p className="text-gray-400">Upload a PDF document and convert it to an engaging podcast</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upload & Language Panel */}
          <div className="bg-white/10 p-6 rounded-xl border border-white/20 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-white text-lg font-semibold flex items-center">
                <Upload size={18} className="mr-2" /> Upload PDF
              </h3>
              {file && (
                <button
                  onClick={() => {
                    setFile(null);
                    setAudioURL('');
                    setPodcastScript('');
                    setParagraphs([]);
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <div className="text-center border-2 border-dashed border-gray-400 rounded-lg p-6">
              <FileText size={40} className="mx-auto mb-3 text-gray-400" />
              <p className="text-gray-300">Select or drag a PDF file</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-purple-600 text-white px-4 py-2 mt-2 rounded-lg hover:bg-purple-700 transition"
              >
                Browse Files
              </button>
              <p className="text-xs text-gray-400 mt-4">Supports PDF files only</p>
            </div>

            {file && (
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-white text-sm font-medium">Selected File:</p>
                <p className="text-gray-300 text-xs truncate">{file.name}</p>
                <p className="text-gray-400 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}

            {/* Language Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">Choose Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-2 rounded text-black bg-purple-500/90 outline-0"
              >
                {languageOptions.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              {selectedLanguage === 'custom' && (
                <input
                  type="text"
                  placeholder="Enter custom language code (e.g., 'de-DE')"
                  value={customLanguage}
                  onChange={(e) => setCustomLanguage(e.target.value)}
                  className="w-full p-2 rounded bg-white/20 outline-0 font-semibold mt-1 text-white placeholder-gray-300"
                />
              )}
            </div>

            {/* Selected Language Display */}
            {selectedLanguage && (
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <p className="text-purple-200 text-sm">
                  <strong>Selected:</strong> {getLanguageName()} ({getLanguageCode()})
                </p>
              </div>
            )}

            <button
              onClick={generatePodcast}
              disabled={!file || isGenerating || (selectedLanguage === 'custom' && !customLanguage)}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white py-3 rounded transition flex items-center justify-center"
            >
              <Volume2 size={18} className="mr-2" />
              {isGenerating ? 'Generating Podcast...' : 'Generate Podcast'}
            </button>

            {/* Audio Player */}
            {audioURL && (
              <div className="space-y-3">
                <audio
                  ref={audioRef}
                  src={audioURL}
                  onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
                  onLoadedMetadata={() => setDuration(audioRef.current.duration)}
                  onEnded={() => setIsPlaying(false)}
                  hidden
                />
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlay}
                    className="bg-purple-600 p-3 rounded-full text-white hover:bg-purple-700"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <div className="flex-1">
                    <div className="bg-gray-600 h-2 rounded-full">
                      <div
                        className="bg-purple-400 h-2 rounded-full"
                        style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 mt-1">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={downloadPodcast}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
                >
                  <Download size={18} className="inline-block mr-2" />
                  Download Podcast
                </button>
              </div>
            )}
          </div>

          {/* Podcast Script Display */}
          <div className="lg:col-span-2 bg-white/10 p-6 rounded-xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-semibold flex items-center">
                <BookOpen size={18} className="mr-2" />
                Podcast Script
              </h3>
              {podcastScript && (
                <button
                  onClick={downloadScript}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
                >
                  <Download size={14} className="inline-block mr-1" />
                  Download Script
                </button>
              )}
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 h-96 overflow-y-auto hide-scrollbar">
              {isGenerating ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
                    <p className="text-gray-400">Generating podcast script...</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Language: {getLanguageName()} ({getLanguageCode()})
                    </p>
                  </div>
                </div>
              ) : podcastScript ? (
                <div className="space-y-4">
                  <div className="mb-4 p-3 bg-purple-500/20 rounded-lg">
                    <p className="text-purple-200 text-sm">
                      <strong>Generated in:</strong> {getLanguageName()} ({getLanguageCode()})
                    </p>
                  </div>
{paragraphs.map((line, index) => (
  <div
    key={line.id || index}
    className={`p-3 rounded-lg transition-all duration-300 ${
      index === currentParagraph && isPlaying
        ? 'bg-purple-500/30 border-l-4 border-purple-400 shadow-lg'
        : 'bg-white/5'
    }`}
  >
    <div className="flex justify-between items-start mb-2">
      <span className="text-xs text-gray-400">Paragraph {index + 1}</span>
      {index === currentParagraph && isPlaying && (
        <span className="text-xs text-purple-300 animate-pulse">● Playing</span>
      )}
    </div>

    <p className={`text-gray-200 leading-relaxed ${
      index === currentParagraph && isPlaying ? 'text-white font-medium' : ''
    }`}>
      <strong>{line.speaker}:</strong> {line.text}
    </p>

    {/* ✅ SAFE AUDIO PLAYER */}
    {line.audioUrls?.[0] ? (
      <audio
        controls
        className="mt-2"
        src={`${import.meta.env.VITE_BASE_URL}${line.audioUrls[0]}`}
      />
    ) : (
      <span className="text-red-400 text-xs mt-1 block">No audio for this part.</span>
    )}
  </div>
))}

                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-400 mb-2">
                      Upload a PDF and generate a podcast to see the script here
                    </p>
                    <p className="text-gray-500 text-sm">
                      Supports 40+ languages including Indian regional languages
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainMenu>
  );
};

export default PdfToPodcast;