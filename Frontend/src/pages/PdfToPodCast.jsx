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

  // You can uncomment this useEffect if user authentication is required
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const [file, setFile] = useState(null);
  const [audioURL, setAudioURL] = useState(''); // This will be the current audio segment being played by the main player
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [podcastScript, setPodcastScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [customLanguage, setCustomLanguage] = useState('');
  const [currentParagraph, setCurrentParagraph] = useState(0); // This will track the currently highlighted paragraph
  const [paragraphs, setParagraphs] = useState([]); // Stores speaker, text, and audioUrls for each paragraph

  const [audioQueue, setAudioQueue] = useState([]); // Stores all individual audio URLs in sequence
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0); // Index for the audioQueue

  const fileInputRef = useRef(null);
  const audioRef = useRef(null); // Ref for the single main audio player

  // Language options with codes
  const languageOptions = [
    { code: 'en', name: 'English' },
    { code: 'hi-IN', name: 'Hindi' },
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
    formData.append("languageCode", getLanguageCode());
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

      const { script, audio = [], languageCode } = response.data;

      if (!Array.isArray(audio)) {
        throw new Error("Invalid response: audio field missing or not an array");
      }

      // Set the full script for display
      setPodcastScript(script.map(s => `${s.speaker}: ${s.text}`).join('\n\n'));
      // Store paragraph data including audio URLs for queuing and highlighting
      setParagraphs(audio);

      // Create a flat queue of all audio URLs from the paragraphs
      const queue = audio.flatMap(p => p.audioUrls || []);
      setAudioQueue(queue);

      // Reset audio playback states
      setCurrentAudioIndex(0);
      setAudioURL(queue[0] || ''); // Set the first audio segment to the main player
      setIsPlaying(false); // Do not auto-play immediately after generation
      setCurrentTime(0);
      setDuration(0);
      setCurrentParagraph(0); // Start highlighting from the first paragraph

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
      // Reset all related states when a new file is selected
      setPodcastScript('');
      setParagraphs([]);
      setCurrentTime(0);
      setDuration(0);
      setCurrentParagraph(0);
      setAudioURL('');
      setAudioQueue([]);
      setCurrentAudioIndex(0);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } else {
      alert('Please select a PDF file.');
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      if (audioQueue.length === 0) {
        // No audio generated yet
        return alert("Please generate the podcast first.");
      }

      // If audioURL is empty (e.g., first play after generation or file reset),
      // set it to the current audio segment in the queue.
      if (!audioURL && audioQueue[currentAudioIndex]) {
        setAudioURL(audioQueue[currentAudioIndex]);
        // A small delay to ensure audioURL is updated before playing
        setTimeout(() => audio.play(), 100);
      } else {
        audio.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  // Update currentParagraph state to match currentAudioIndex for highlighting
  useEffect(() => {
    setCurrentParagraph(currentAudioIndex);
    // When the audioURL changes (meaning a new segment is loaded for playback),
    // if the player was already playing, try to play the new segment.
    if (isPlaying && audioRef.current && audioURL) {
      audioRef.current.play().catch(e => console.error("Error playing audio segment:", e));
    }
  }, [currentAudioIndex, audioURL, isPlaying]);


  const getLanguageCode = () =>
    selectedLanguage === 'custom' ? customLanguage : selectedLanguage;

  const getLanguageName = () => {
    const lang = languageOptions.find(l => l.code === selectedLanguage);
    return selectedLanguage === 'custom' ? customLanguage : (lang?.name || '');
  };

  const downloadPodcast = () => {
    // This function downloads only the *currently set* audioURL, which is one segment.
    // For a full podcast download, the backend would need to provide a single concatenated MP3.
    // As per the current implementation where audio is fetched segment by segment,
    // this would download the last played segment.
    // To download the *entire* podcast, you'd need a separate endpoint from your backend
    // that concatenates all audio segments into a single file and provides a URL for it.
    if (!audioURL) return alert("No podcast audio to download.");
    alert("This will download the currently loaded audio segment. For the full podcast, a separate download feature needs to be implemented backend.");
    const a = document.createElement('a');
    a.href = audioURL;
    a.download = `podcast_segment_${currentAudioIndex + 1}.mp3`;
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
                    setIsPlaying(false);
                    setCurrentTime(0);
                    setDuration(0);
                    setCurrentParagraph(0);
                    setAudioQueue([]);
                    setCurrentAudioIndex(0);
                    if (audioRef.current) {
                      audioRef.current.pause();
                      audioRef.current.currentTime = 0;
                    }
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

            {/* Main Audio Player */}
            {(audioQueue.length > 0 || isGenerating) && ( // Show player if audio generated or is being generated
              <div className="space-y-3">
                <audio
                  ref={audioRef}
                  // The src is controlled by audioURL state, which is updated from audioQueue
                  src={audioURL.startsWith("http") ? audioURL : `${import.meta.env.VITE_BASE_URL}${audioURL}`}
                  onTimeUpdate={() => {
                    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
                  }}
                  onLoadedMetadata={() => {
                    if (audioRef.current) setDuration(audioRef.current.duration);
                  }}
                  onEnded={() => {
                    if (currentAudioIndex < audioQueue.length - 1) {
                      const nextIndex = currentAudioIndex + 1;
                      setCurrentAudioIndex(nextIndex);
                      // Update audioURL to trigger loading of the next segment
                      setAudioURL(audioQueue[nextIndex]);
                      // Auto-play the next segment is handled by useEffect after audioURL updates
                    } else {
                      setIsPlaying(false); // All segments played
                      setCurrentAudioIndex(0); // Reset for next full play-through
                      setCurrentTime(0); // Reset time for next play-through
                      setAudioURL(audioQueue[0] || ''); // Reset to first audio for replay
                    }
                  }}
                  hidden // Keep it hidden, control with custom UI
                />

                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlay}
                    disabled={audioQueue.length === 0 && !isGenerating}
                    className="bg-purple-600 p-3 rounded-full text-white hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-400"
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
                  disabled={!audioURL}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition disabled:bg-gray-700 disabled:text-gray-400"
                >
                  <Download size={18} className="inline-block mr-2" />
                  Download Current Segment
                </button>
                {/* Note: A "Download Full Podcast" button would require a separate backend endpoint */}
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

            <div className="bg-white/5 rounded-lg  h-100 overflow-y-auto hide-scrollbar">
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
                        index === currentParagraph && isPlaying // Highlight based on currentParagraph and playing status
                          ? 'bg-green-500/30 border-l-4 border-green-400 shadow-lg'
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
                      {/* Removed the individual <audio> player here */}
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