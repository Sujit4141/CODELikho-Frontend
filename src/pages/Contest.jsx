import { useState, useEffect } from "react";
import Navbar from "../../componenets/Navbar";

function Contest() {
  const [upcomingContests, setUpcomingContests] = useState([
    {
      id: 1,
      name: "Weekly Contest 389",
      startTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
      duration: 90,
      registered: true
    },
    {
      id: 2,
      name: "Biweekly Contest 129",
      startTime: new Date(Date.now() + 72 * 60 * 60 * 1000),
      duration: 90,
      registered: false
    },
    {
      id: 3,
      name: "Beginner's Challenge",
      startTime: new Date(Date.now() + 120 * 60 * 60 * 1000),
      duration: 60,
      registered: false
    }
  ]);

  const [pastContests, setPastContests] = useState([
    {
      id: 4,
      name: "Weekly Contest 388",
      startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      duration: 90,
      solved: 3,
      total: 4,
      ranking: 125
    },
    {
      id: 5,
      name: "Biweekly Contest 128",
      startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      duration: 90,
      solved: 4,
      total: 4,
      ranking: 42
    },
    {
      id: 6,
      name: "Algorithm Challenge #15",
      startTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      duration: 60,
      solved: 2,
      total: 4,
      ranking: 78
    }
  ]);

  const [timeRemaining, setTimeRemaining] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeRemaining = {};
      upcomingContests.forEach(contest => {
        const diff = contest.startTime - new Date();
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / 1000 / 60) % 60);
          const seconds = Math.floor((diff / 1000) % 60);
          newTimeRemaining[contest.id] = { days, hours, minutes, seconds };
        }
      });
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [upcomingContests]);

  const registerForContest = (id) => {
    setUpcomingContests(upcomingContests.map(contest =>
      contest.id === id ? { ...contest, registered: true } : contest
    ));
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 relative">
        <Navbar />

        {/* Overlay with blur and coming soon message */}
        <div className="relative">
          {/* Blurred Main Content */}
          <div className="pointer-events-none select-none filter blur-[5px]">
            <div className="max-w-6xl mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Contests</h1>

              {/* Upcoming Contests */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-gray-700">Upcoming Contests</h2>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Registered</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcomingContests.map(contest => (
                    <div
                      key={contest.id}
                      className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${contest.registered ? 'border-green-500' : 'border-blue-500'
                        }`}
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">{contest.name}</h3>
                            <p className="text-gray-600 mt-1">
                              {contest.startTime.toLocaleDateString()} at{' '}
                              {contest.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <p className="text-gray-600 mt-1">
                              Duration: {contest.duration} minutes
                            </p>
                          </div>
                          {contest.registered && (
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                              Registered
                            </span>
                          )}
                        </div>

                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Starts in:</span>
                            <span className="text-sm font-medium text-gray-700">
                              {timeRemaining[contest.id]
                                ? `${timeRemaining[contest.id].days}d ${timeRemaining[contest.id].hours}h ${timeRemaining[contest.id].minutes}m`
                                : 'Starting soon...'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${Math.min(
                                  (1 - (contest.startTime - new Date()) / (48 * 60 * 60 * 1000)) * 100,
                                  100
                                )}%`
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="mt-6 flex justify-between">
                          {contest.registered ? (
                            <button
                              className={`px-4 py-2 rounded-lg font-medium ${contest.startTime - new Date() < 0
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                              disabled={contest.startTime - new Date() > 0}
                            >
                              Enter Contest
                            </button>
                          ) : (
                            <button
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                              onClick={() => registerForContest(contest.id)}
                            >
                              Register
                            </button>
                          )}
                          <button className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Past Contests */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Past Contests</h2>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contest
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Solved
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ranking
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pastContests.map(contest => (
                        <tr key={contest.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{contest.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {contest.startTime.toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {contest.solved}/{contest.total} problems
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              #{contest.ranking}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-blue-600 hover:text-blue-900 mr-4">
                              View Problems
                            </button>
                            <button className="text-blue-600 hover:text-blue-900">
                              View Standings
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex justify-center">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                    Show More
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon Overlay (Above Content) */}
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
  <div className="text-center p-6 rounded-xl">
    <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-500 via-yellow-400 to-green-400 text-transparent bg-clip-text animate-pulse drop-shadow-lg">
      🚧 Coming Soon 🚀
    </h1>
    <p className="mt-4 text-xl md:text-2xl font-semibold text-white drop-shadow">
      This feature is under development.<br />Stay tuned for the launch!
    </p>
  </div>
</div>
        </div>
      </div>
    </>
  );
}

export default Contest;
