import { PageWrapper } from "../components/layout/PageWrapper";
import { Bell, AlertTriangle, CheckCircle, Info, Calendar, Award, MessageSquare } from "lucide-react";

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: "academic",
      title: "Emma's Mathematics Grade Improved",
      message: "Emma scored 94% on her latest mathematics test, showing a 8% improvement from the previous assessment.",
      time: "2 hours ago",
      read: false,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      id: 2,
      type: "attendance",
      title: "Michael's Attendance Alert",
      message: "Michael has been absent for 3 consecutive days. Please contact the school if there's a valid reason.",
      time: "1 day ago",
      read: false,
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
    {
      id: 3,
      type: "achievement",
      title: "Emma Won Science Fair",
      message: "Congratulations! Emma's science project won first place in the annual school science fair.",
      time: "2 days ago",
      read: true,
      icon: Award,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50"
    },
    {
      id: 4,
      type: "schedule",
      title: "Parent-Teacher Meeting Scheduled",
      message: "A parent-teacher meeting has been scheduled for next Friday at 3:00 PM. Please confirm your attendance.",
      time: "3 days ago",
      read: true,
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      id: 5,
      type: "general",
      title: "School Holiday Notice",
      message: "School will be closed on Monday due to a public holiday. Classes will resume on Tuesday.",
      time: "4 days ago",
      read: true,
      icon: Info,
      color: "text-gray-500",
      bgColor: "bg-gray-50"
    },
    {
      id: 6,
      type: "message",
      title: "Message from Mathematics Teacher",
      message: "Dear Parent, Emma has shown excellent progress in algebra. Please encourage her to continue practicing at home.",
      time: "5 days ago",
      read: true,
      icon: MessageSquare,
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      id: 7,
      type: "academic",
      title: "Michael's English Assignment Due",
      message: "Michael has an English literature assignment due next week. Please ensure he completes it on time.",
      time: "1 week ago",
      read: true,
      icon: Info,
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      id: 8,
      type: "achievement",
      title: "Emma's Perfect Attendance",
      message: "Emma has achieved perfect attendance for the month of January. Great job maintaining regular attendance!",
      time: "1 week ago",
      read: true,
      icon: Award,
      color: "text-green-500",
      bgColor: "bg-green-50"
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <PageWrapper portal="parent" userName="Parent User" userRole="Parent">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                notification.read ? 'border-gray-200' : 'border-emerald-500'
              } ${!notification.read ? 'bg-emerald-50' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${notification.bgColor}`}>
                  <notification.icon className={`w-5 h-5 ${notification.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold ${notification.read ? 'text-gray-900' : 'text-gray-900'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-sm text-gray-500">{notification.time}</span>
                  </div>
                  <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-700'}`}>
                    {notification.message}
                  </p>
                  {!notification.read && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        New
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">You're all caught up! Check back later for updates.</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Notifications;