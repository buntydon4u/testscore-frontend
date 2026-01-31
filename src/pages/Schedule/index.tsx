import { Calendar, Clock } from "lucide-react";

export const Schedule = () => {
  const schedules = [
    { course: "Mathematics", teacher: "Dr. Robert Smith", time: "09:00 AM - 10:30 AM", day: "Monday", room: "Room 101" },
    { course: "Physics", teacher: "Prof. Emily Davis", time: "11:00 AM - 12:30 PM", day: "Monday", room: "Lab 201" },
    { course: "Chemistry", teacher: "Dr. Michael Chen", time: "02:00 PM - 03:30 PM", day: "Tuesday", room: "Lab 301" },
    { course: "Biology", teacher: "Prof. Sarah Johnson", time: "09:00 AM - 10:30 AM", day: "Wednesday", room: "Room 102" },
  ];

  return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Schedule</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schedules.map((schedule, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{schedule.course}</h3>
                  <p className="text-sm text-gray-600">{schedule.teacher}</p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                  {schedule.day}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {schedule.time}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {schedule.room}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
};
