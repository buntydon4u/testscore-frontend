export const IllustrationPanel = () => {
  return (
    <div className="bg-slate-800 flex items-center justify-center p-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500 rounded-full animate-pulse delay-75"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-500 rounded-full animate-pulse delay-150"></div>
      </div>

      {/* Main illustration content */}
      <div className="relative z-10 max-w-lg text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-emerald-500 rounded-full mb-6 animate-bounce">
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">
          TestScore
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Streamline your educational journey with our comprehensive exam management system
        </p>

        {/* Feature icons */}
        <div className="grid grid-cols-3 gap-6 mt-12">
          <div className="flex flex-col items-center transform hover:scale-110 transition-transform">
            <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-300">Exams</span>
          </div>

          <div className="flex flex-col items-center transform hover:scale-110 transition-transform">
            <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-300">Students</span>
          </div>

          <div className="flex flex-col items-center transform hover:scale-110 transition-transform">
            <div className="w-16 h-16 bg-emerald-500 rounded-lg flex items-center justify-center mb-3">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-300">Results</span>
          </div>
        </div>
      </div>
    </div>
  );
};
