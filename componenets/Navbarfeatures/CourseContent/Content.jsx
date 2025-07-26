import Navbar from "../../Navbar";
import { useState, useEffect } from "react";
import axiosClient from "../../../src/utils/axiosClient";
import { useParams } from "react-router";
import { FaPlay, FaList, FaArrowLeft, FaArrowRight, FaRegClock, FaCheck, FaCheckCircle } from "react-icons/fa";
import { BsFillPlayCircleFill } from "react-icons/bs";
import { motion } from "framer-motion";


function Content() {
  const { id } = useParams();
  const [content, setContent] = useState([]);
  const [playlistId, setPlaylistId] = useState("");
  const [currentVideo, setCurrentVideo] = useState(null);
  const [nextPageToken, setNextPageToken] = useState("");
  const [prevPageToken, setPrevPageToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const youtubeApi = import.meta.env.VITE_YOUTUBE;
  const [videoLoading, setVideoLoading] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [completedVideos, setCompletedVideos] = useState({});

  useEffect(() => {
    const savedCompletedVideos = localStorage.getItem(`completedVideos_${playlistId}`);
    if (savedCompletedVideos) {
      setCompletedVideos(JSON.parse(savedCompletedVideos));
    }
  }, [playlistId]);

  useEffect(() => {
    if (playlistId && Object.keys(completedVideos).length > 0) {
      localStorage.setItem(`completedVideos_${playlistId}`, JSON.stringify(completedVideos));
    }
  }, [completedVideos, playlistId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/course/getCourse/${id}`);
        if (response.data.playlistid) {
          setPlaylistId(response.data.playlistid);
        } else {
          setError("This course doesn't have any videos");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course content");
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const fetchVideos = async (pageToken = "") => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${youtubeApi}&maxResults=5&pageToken=${pageToken}`
      );
      const data = await response.json();
      if (data.error) {
        setError(data.error.message);
        return;
      }

      setContent(data.items || []);
      setNextPageToken(data.nextPageToken || "");
      setPrevPageToken(data.prevPageToken || "");

      if (data.items && data.items.length > 0) {
        setCurrentVideo(data.items[0]);
      }

      setError(null);
    } catch (err) {
      console.error("YouTube API error:", err);
      setError("Failed to load videos. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (playlistId && youtubeApi) {
      fetchVideos();
    }
  }, [playlistId, youtubeApi]);

  const handleVideoSelect = (video) => {
    setVideoLoading(true);
    setCurrentVideo(video);
    setTimeout(() => setVideoLoading(false), 300);
  };

  const handleNextPage = () => {
    if (nextPageToken) {
      fetchVideos(nextPageToken);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (prevPageToken) {
      fetchVideos(prevPageToken);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleVideoCompletion = (videoId) => {
    setCompletedVideos(prev => {
      const newState = { ...prev, [videoId]: !prev[videoId] };
      return newState;
    });
  };

  const getCompletedCount = () => {
    return Object.values(completedVideos).filter(status => status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] to-[#e6f7ff] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-xl font-medium text-gray-700">Loading course content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] to-[#e6f7ff] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl max-w-md">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Content Unavailable</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.history.back()}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] to-[#e6f7ff] flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Video Player */}
          <div className="lg:w-3/4">
            <div className="bg-black rounded-xl overflow-hidden shadow-2xl w-full" style={{ aspectRatio: '16 / 9', minHeight: '400px' }}>
              {videoLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <div className="animate-spin rounded-full h-10 w-12 border-t-4 border-b-4 border-indigo-600"></div>
                </div>
              ) : currentVideo ? (
               <iframe
  src={`https://www.youtube.com/embed/${currentVideo.snippet.resourceId.videoId}?autoplay=1&modestbranding=1&rel=0&controls=1&disablekb=1&fs=0&showinfo=0`}
  className="w-full h-full"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
  title={currentVideo.snippet.title}
/>

              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-indigo-900 to-purple-800">
                  <BsFillPlayCircleFill className="text-white text-6xl opacity-70" />
                </div>
              )}
            </div>

            {currentVideo && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentVideo.snippet.title}</h1>
                  <button
                    onClick={() => toggleVideoCompletion(currentVideo.snippet.resourceId.videoId)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-lg ${
                      completedVideos[currentVideo.snippet.resourceId.videoId]
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {completedVideos[currentVideo.snippet.resourceId.videoId] ? (
                      <FaCheckCircle className="text-green-600" />
                    ) : (
                      <FaCheck />
                    )}
                    <span>{completedVideos[currentVideo.snippet.resourceId.videoId] ? "Completed" : "Mark Complete"}</span>
                  </button>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                  <FaRegClock className="mr-2" />
                  <span>Published on: {new Date(currentVideo.snippet.publishedAt).toLocaleDateString()}</span>
                </div>

                <div className="relative">
                  <p className={`text-gray-700 whitespace-pre-line transition-all duration-300 text-sm leading-relaxed ${
                    showFullDescription ? '' : 'max-h-20 overflow-hidden'
                  }`}>
                    {currentVideo.snippet.description || "No description available"}
                  </p>
                  {currentVideo.snippet.description && currentVideo.snippet.description.length > 200 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="mt-2 text-indigo-600 font-medium hover:text-indigo-800 transition-colors text-sm"
                    >
                      {showFullDescription ? 'Show Less' : 'Read More...'}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Playlist & Progress */}
          <div className="lg:w-1/4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-4 flex items-center">
                <FaList className="text-white text-xl mr-3" />
                <h2 className="text-xl font-bold text-white">Course Videos</h2>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                {content.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">No videos found in this playlist</div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {content.map((item, index) => {
                      const videoId = item.snippet.resourceId.videoId;
                      const isCompleted = completedVideos[videoId];
                      return (
                        <motion.li
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 hover:bg-indigo-50 cursor-pointer transition-colors ${
                            currentVideo?.id === item.id 
                              ? "bg-indigo-50 border-l-4 border-indigo-500" 
                              : ""
                          } ${isCompleted ? "bg-green-50 border-l-4 border-green-500" : ""}`}
                          onClick={() => handleVideoSelect(item)}
                        >
                          <div className="flex">
                            <div className="relative flex-shrink-0 mr-4">
                              <img
                                src={item.snippet.thumbnails.medium.url}
                                alt={item.snippet.title}
                                className="w-24 h-14 rounded-md object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-black/60 rounded-full p-1">
                                  <FaPlay className="text-white text-xs" />
                                </div>
                              </div>
                              {isCompleted && (
                                <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1">
                                  <FaCheck className="text-white text-xs" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-medium truncate ${isCompleted ? "text-green-700" : "text-gray-900"}`}>
                                {item.snippet.title}
                              </h3>
                              <p className="text-sm text-gray-500 truncate">{item.snippet.channelTitle}</p>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {(nextPageToken || prevPageToken) && (
                <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between sm:px-6">
                  <div>
                    {prevPageToken && (
                      <button
                        onClick={handlePrevPage}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <FaArrowLeft className="mr-2" />
                        Previous
                      </button>
                    )}
                  </div>
                  <div>
                    {nextPageToken && (
                      <button
                        onClick={handleNextPage}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Next
                        <FaArrowRight className="ml-2" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
            >
              <h3 className="text-lg font-bold mb-2">Your Progress</h3>
              <div className="text-3xl font-bold mb-2">
                {getCompletedCount()} / {content.length}
              </div>
              <p className="text-sm opacity-90">
                {content.length > 0 
                  ? `${Math.round((getCompletedCount() / content.length) * 100)}% completed` 
                  : 'No videos'}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Content;
