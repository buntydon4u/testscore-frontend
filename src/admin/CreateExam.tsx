import { CreateExamForm } from '../components/exam/CreateExamForm';

export const CreateExam = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Exam</h1>
        <p className="text-gray-600">Create a new exam with schedules and configurations</p>
      </div>

      <CreateExamForm />
    </div>
  );
};
