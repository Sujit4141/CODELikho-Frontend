// src/components/VideoJsPlayer.jsx
import React, { useRef, useState, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
// import 'videojs-youtube';
import { FaPlay, FaPause, FaExpand, FaCompress, FaVolumeUp, FaVolumeMute, FaCog, FaStepBackward, FaStepForward, FaTachometerAlt } from 'react-icons/fa';

const 
 CustomVideoPlayer = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [quality, setQuality] = useState('auto');
  const [fullscreen, setFullscreen] = useState(false);
  const [showSpeedSettings, setShowSpeedSettings] = useState(false);
  const [showQualitySettings, setShowQualitySettings] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [error, setError] = useState(null);

  // Initialize the player
  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const player = playerRef.current = videojs(videoElement, {
        controls: false,
        autoplay: false,
        preload: 'auto',
        fluid: true,
        techOrder: ['youtube'],
        sources: [{
          type: 'video/youtube',
          src: 'https://www.youtube.com/watch?v=iKLqkk6j_8c'
        }],
        youtube: {
          ytControls: 0, // Hide YouTube native controls
          enablePrivacyEnhancedMode: true
        }
      }, () => {
        console.log('Player is ready');
        setPlayerReady(true);
      });

      // Event listeners
      player.on('play', () => setPlaying(true));
      player.on('pause', () => setPlaying(false));
      player.on('volumechange', () => {
        setVolume(player.volume());
        setMuted(player.muted());
      });
      player.on('timeupdate', () => setCurrentTime(player.currentTime()));
      player.on('loadedmetadata', () => setDuration(player.duration()));
      player.on('error', (e) => {
        console.error('Player error:', e);
        setError('Failed to load video. Please try again.');
      });
    }

    // Cleanup function
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  // Handle play/pause
  const handlePlayPause = () => {
    if (playerRef.current) {
      playing ? playerRef.current.pause() : playerRef.current.play();
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (playerRef.current) {
      playerRef.current.volume(newVolume);
      setVolume(newVolume);
      if (newVolume === 0) {
        playerRef.current.muted(true);
        setMuted(true);
      } else if (muted) {
        playerRef.current.muted(false);
        setMuted(false);
      }
    }
  };

  // Handle mute toggle
  const handleMute = () => {
    if (playerRef.current) {
      playerRef.current.muted(!muted);
      setMuted(!muted);
    }
  };

  // Handle seeking
  const handleSeek = (e) => {
    const seekTo = parseFloat(e.target.value);
    const time = seekTo * duration;
    setCurrentTime(time);
    if (playerRef.current) {
      playerRef.current.currentTime(time);
    }
  };

  // Handle playback rate change
  const handlePlaybackRate = (rate) => {
    if (playerRef.current) {
      playerRef.current.playbackRate(rate);
      setPlaybackRate(rate);
      setShowSpeedSettings(false);
    }
  };

  // Handle quality change
  const handleQuality = (q) => {
    setQuality(q);
    setShowQualitySettings(false);
    // In a real app, you would set the quality here
    console.log('Quality changed to:', q);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (playerRef.current) {
      if (playerRef.current.isFullscreen()) {
        playerRef.current.exitFullscreen();
      } else {
        playerRef.current.requestFullscreen();
      }
    }
  };

  // Format time for display (MM:SS)
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === Infinity) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Skip backward/forward
  const handleSkip = (seconds) => {
    if (playerRef.current) {
      const newTime = Math.max(0, playerRef.current.currentTime() + seconds);
      playerRef.current.currentTime(newTime);
      setCurrentTime(newTime);
    }
  };

  return (
    <div className="w-full">
      <div 
        className="relative bg-black rounded-lg overflow-hidden shadow-2xl"
        style={{ height: '340px' }}
      >
        {/* Loading overlay */}
        {!playerReady && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
              <p className="text-white">Loading player...</p>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-30 p-4">
            <div className="text-center">
              <p className="text-red-500 font-bold text-lg">Video Error</p>
              <p className="text-white text-sm mt-2">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 text-white"
              >
                Reload Player
              </button>
            </div>
          </div>
        )}
        
        <div data-vjs-player>
          <video
            ref={videoRef}
            className="video-js vjs-big-play-centered"
          />
        </div>
        
        {/* Custom Controls Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 hover:opacity-100 transition-opacity z-10">
          {/* Progress Bar */}
          <div className="flex items-center w-full mb-2">
            <button 
              onClick={() => handleSkip(-10)}
              className="text-white hover:text-indigo-300 transition-colors mr-2"
              title="Skip back 10 seconds"
            >
              <FaStepBackward />
            </button>
            
            <input
              type="range"
              min={0}
              max={1}
              step="any"
              value={duration > 0 ? currentTime / duration : 0}
              onChange={handleSeek}
              className="w-full h-1.5 rounded-full appearance-none bg-gray-700 accent-indigo-500"
            />
            
            <button 
              onClick={() => handleSkip(10)}
              className="text-white hover:text-indigo-300 transition-colors ml-2"
              title="Skip forward 10 seconds"
            >
              <FaStepForward />
            </button>
          </div>
          
          {/* Time Display */}
          <div className="text-white text-xs mb-2 flex justify-between">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          
          {/* Control Bar */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              <button 
                onClick={handlePlayPause}
                className="text-white hover:text-indigo-300 transition-colors"
              >
                {playing ? <FaPause /> : <FaPlay />}
              </button>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleMute}
                  className="text-white hover:text-indigo-300 transition-colors"
                >
                  {muted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1.5 rounded-full appearance-none bg-gray-700 accent-indigo-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              {/* Speed Settings */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowSpeedSettings(!showSpeedSettings);
                    setShowQualitySettings(false);
                  }}
                  className={`text-white hover:text-indigo-300 transition-colors ${showSpeedSettings ? 'text-indigo-400' : ''}`}
                  title="Playback speed"
                >
                  <span className="text-xs font-bold mr-1">{playbackRate}x</span>
                  <FaTachometerAlt />
                </button>
                
                {showSpeedSettings && (
                  <div className="absolute bottom-full right-0 mb-2 w-32 bg-gray-800 rounded-md shadow-lg z-10">
                    <div className="p-2 border-b border-gray-700 text-xs text-gray-400">Speed</div>
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => handlePlaybackRate(rate)}
                        className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-700 ${playbackRate === rate ? 'text-indigo-400' : 'text-white'}`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Quality Settings */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowQualitySettings(!showQualitySettings);
                    setShowSpeedSettings(false);
                  }}
                  className={`text-white hover:text-indigo-300 transition-colors ${showQualitySettings ? 'text-indigo-400' : ''}`}
                  title="Quality settings"
                >
                  <span className="text-xs font-bold">{quality}</span>
              
                </button>
                
                {showQualitySettings && (
                  <div className="absolute bottom-full right-0 mb-2 w-32 bg-gray-800 rounded-md shadow-lg z-10">
                    <div className="p-2 border-b border-gray-700 text-xs text-gray-400">Quality</div>
                    {['auto', '144p', '240p', '360p', '480p', '720p', '1080p'].map((q) => (
                      <button
                        key={q}
                        onClick={() => handleQuality(q)}
                        className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-700 ${quality === q ? 'text-indigo-400' : 'text-white'}`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <button 
                onClick={toggleFullscreen}
                className="text-white hover:text-indigo-300 transition-colors"
                title={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {fullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Current settings indicator */}
        <div className="absolute top-2 right-2 flex space-x-2">
          <span className="bg-black/70 text-indigo-300 text-xs px-2 py-1 rounded">
            {playbackRate}x
          </span>
          <span className="bg-black/70 text-indigo-300 text-xs px-2 py-1 rounded">
            {quality}
          </span>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-bold text-indigo-300 mb-3">Features</h2>
        <ul className="grid grid-cols-2 gap-3 text-sm text-gray-300">
          <li className="flex items-center">
            <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
            YouTube video support
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
            Custom dark theme
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
            Playback speed control
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
            Video quality selection
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
            10-second skip buttons
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
            Fullscreen toggle
          </li>
        </ul>
      </div>
    </div>
  );
};

export default 
 CustomVideoPlayer;












