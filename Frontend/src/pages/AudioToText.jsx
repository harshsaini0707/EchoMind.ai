import React, { useRef, useState } from 'react';
import {
  Upload, Play, Pause, Download, FileAudio, Trash2
} from 'lucide-react';
import MainMenu from './MainMenu';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AudioToText = () => {
  const [file, setFile] = useState(null);
  const [audioURL, setAudioURL] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [customLanguage, setCustomLanguage] = useState('');

  const fileInputRef = useRef(null);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  const Audio = async () => {
    if (!file) return alert("Please upload an audio file.");
    setIsTranscribing(true);

    const formData = new FormData();
    formData.append("audio", file);
    formData.append("language", getLanguage());

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/audio/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      const { data } = response.data;
      setTranscript(data.transcribedText);
      setSelectedLanguage(data.language);
      setAudioURL(data.audioUrl);
    } catch (error) {
      if (error?.response?.status === 401) {
        return navigate("/login");
      } else {
        console.error("Upload failed:", error);
        alert("Failed to transcribe audio.");
      }
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected?.type.startsWith('audio/')) {
      setFile(selected);
      setAudioURL(URL.createObjectURL(selected));
      setTranscript('');
      setCurrentTime(0);
      setDuration(0);
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    isPlaying ? audio.pause() : audio.play();
    setIsPlaying(!isPlaying);
  };

  const getLanguage = () =>
    selectedLanguage === 'Custom' ? customLanguage : selectedLanguage;

  const downloadTranscript = () => {
    if (!transcript) return alert("No transcript to download.");
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (time) =>
    `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, '0')}`;

  return (
    <MainMenu>
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Audio to Text</h2>
          <p className="text-gray-400">Upload an audio file and convert it to text</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload & Language Panel */}
          <div className="bg-white/10 p-6 rounded-xl border border-white/20 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-white text-lg font-semibold flex items-center">
                <Upload size={18} className="mr-2" /> Upload Audio
              </h3>
              {file && (
                <button
                  onClick={() => {
                    setFile(null);
                    setAudioURL('');
                    setTranscript('');
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <div className="text-center border-2 border-dashed border-gray-400 rounded-lg p-6">
              <FileAudio size={40} className="mx-auto mb-3 text-gray-400" />
              <p className="text-gray-300">Select or drag an audio file</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-purple-600 text-white px-4 py-2 mt-2 rounded-lg hover:bg-purple-700 transition"
              >
                Browse Files
              </button>
              <p className="text-xs text-gray-400 mt-4">Supports MP3, WAV, M4A</p>
            </div>

            {/* Language Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">Choose Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-2 rounded text-black bg-purple-500/90 outline-0"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Custom</option>
              </select>
              {selectedLanguage === 'Custom' && (
                <input
                  type="text"
                  placeholder="Enter custom language"
                  value={customLanguage}
                  onChange={(e) => setCustomLanguage(e.target.value)}
                  className="w-full p-2 rounded bg-white/20 outline-0 font-semibold mt-1"
                />
              )}
            </div>

            {/* Player & Transcribe */}
            {audioURL && (
              <>
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
                    className="bg-purple-600 p-2 rounded-full text-white hover:bg-purple-700"
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
                  onClick={Audio}
                  disabled={isTranscribing}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded transition"
                >
                  {isTranscribing ? 'Transcribing...' : 'Start Transcription'}
                </button>
              </>
            )}
          </div>

          {/* Transcript Display */}
          <div className="bg-white/10 p-6 rounded-xl border border-white/20">
            <div className="flex justify-between items-center mb-2">
              <h3 
              style={{
                lineHeight:"1.8"
              }}
              className="text-white text-lg font-semibold flex items-center">
                <FileAudio size={18} className="mr-2" />
                Transcript
              </h3>
            </div>
            <div className="bg-white/5 rounded p-4 h-100 overflow-y-auto hide-scrollbar text-gray-200 font-bold text-shadow-none whitespace-pre-wrap leading-relaxed">
              {isTranscribing ? (
                <p className="text-center text-gray-400">Generating transcript...</p>
              ) : transcript ? (
                transcript
              ) : (
                <p className="text-center text-gray-400">Transcript will appear here</p>
              )}
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={downloadTranscript}
                disabled={!transcript}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-4 py-2 rounded transition"
              >
                <Download size={18} className="inline-block mr-2" />
                Download Transcript
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainMenu>
  );
};

export default AudioToText;
