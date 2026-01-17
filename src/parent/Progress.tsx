import { PageWrapper } from "../components/layout/PageWrapper";
import { TrendingUp, TrendingDown, Target, BookOpen, Clock } from "lucide-react";

const Progress = () => {
  const childrenProgress = [
    {
      name: "Emma Johnson",
      grade: "10th Grade",
      avatar: "EJ",
      overallProgress: 87,
      subjects: [
        {
          name: "Mathematics",
          progress: 92,
          completedTopics: 28,
          totalTopics: 30,
          nextMilestone: "Advanced Calculus",
          timeSpent: "45 hours",
          trend: "up"
        },
        {
          name: "Physics",
          progress: 85,
          completedTopics: 22,
          totalTopics: 25,
          nextMilestone: "Quantum Physics",
          timeSpent: "38 hours",
          trend: "up"
        },
        {
          name: "Chemistry",
          progress: 88,
          completedTopics: 26,
          totalTopics: 28,
          nextMilestone: "Organic Chemistry",
          timeSpent: "42 hours",
          trend: "down"
        }
      ],
      achievements: [
        "Completed Algebra Mastery",
        "Physics Lab Excellence",
        "Chemistry Quiz Champion"
      ],
      studyGoals: [
        { goal: "Complete Mathematics syllabus", progress: 93, target: "Feb 2024" },
        { goal: "Improve Physics grade to A+", progress: 78, target: "Mar 2024" },
        { goal: "Master Chemistry lab skills", progress: 85, target: "Feb 2024" }
      ]
    },
    {
      name: "Michael Johnson",
      grade: "8th Grade",
      avatar: "MJ",
      overallProgress: 79,
      subjects: [
        {
          name: "Mathematics",
          progress: 76,
          completedTopics: 18,
          totalTopics: 24,
          nextMilestone: "Geometry Basics",
          timeSpent: "32 hours",
          trend: "down"
        },
        {
          name: "Science",
          progress: 82,
          completedTopics: 20,
          totalTopics: 22,
          nextMilestone: "Ecosystem Study",
          timeSpent: "28 hours",
          trend: "up"
        },
        {
          name: "English",
          progress: 78,
          completedTopics: 15,
          totalTopics: 20,
          nextMilestone: "Literature Analysis",
          timeSpent: "25 hours",
          trend: "up"
        }
      ],
      achievements: [
        "Science Fair Winner",
        "Reading Challenge Complete",
        "Math Problem Solver"
      ],
      studyGoals: [
        { goal: "Read 50 books this year", progress: 68, target: "Dec 2024" },
        { goal: "Master multiplication tables", progress: 95, target: "Jan 2024" },
        { goal: "Complete science project", progress: 80, target: "Feb 2024" }
      ]
    }
  ];

  return (
    <PageWrapper portal="parent" userName="Parent User" userRole="Parent">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Children Progress</h1>

        {childrenProgress.map((child, childIndex) => (
          <div key={childIndex} className="mb-8">
            {/* Child Header */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-emerald-600">{child.avatar}</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{child.name}</h2>
                  <p className="text-gray-600">{child.grade}</p>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-2xl font-bold text-gray-900">{child.overallProgress}%</div>
                  <p className="text-sm text-gray-600">Overall Progress</p>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-emerald-500 h-3 rounded-full"
                  style={{ width: `${child.overallProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Subject Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {child.subjects.map((subject, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{subject.progress}%</span>
                      {subject.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Topics Completed</span>
                      <span className="font-medium">{subject.completedTopics}/{subject.totalTopics}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(subject.completedTopics / subject.totalTopics) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Next Milestone</span>
                      <span className="font-medium">{subject.nextMilestone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{subject.timeSpent} this month</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Achievements and Goals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
                <div className="space-y-3">
                  {child.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <Target className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-900">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Goals</h3>
                <div className="space-y-4">
                  {child.studyGoals.map((goal, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{goal.goal}</span>
                        <span className="text-sm text-gray-600">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">Target: {goal.target}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
};

export default Progress;