import React from 'react';

export const TeacherTestPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Teacher Test Page</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-lg">If you can see this page, the teacher routing is working!</p>
        <p className="mt-4">Current URL: {window.location.pathname}</p>
        <button 
          onClick={() => alert('Teacher routing is working!')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test Button
        </button>
      </div>
    </div>
  );
};
