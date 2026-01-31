import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { examService } from '../services/exam';
import { Exam, UpdateExamDto, ExamType, DeliveryType } from '../types/exam';
import { CreateExamForm } from '../components/exam/CreateExamForm';

export const EditExam = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      loadExam();
    }
  }, [id]);

  const loadExam = async () => {
    try {
      const data = await examService.getExamById(id!);
      setExam(data);
    } catch (error) {
      console.error('Failed to load exam:', error);
      alert('Failed to load exam. Please try again.');
      navigate('/super-admin/exams');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    if (!id) return;

    try {
      setSaving(true);
      const updateData: UpdateExamDto = {
        title: formData.title,
        description: formData.description,
        examType: formData.examType,
        deliveryType: formData.deliveryType,
        duration: formData.duration,
        totalMarks: formData.totalMarks,
        isNegativeMarking: formData.isNegativeMarking,
        negativeMarkingValue: formData.negativeMarkingValue,
        isPracticeMode: formData.isPracticeMode,
        classId: formData.classId,
        boardId: formData.boardId,
        seriesId: formData.seriesId,
        blueprintId: formData.blueprintId,
        instructions: formData.instructions,
      };

      await examService.updateExam(id, updateData);
      alert('Exam updated successfully!');
      navigate('/super-admin/exams');
    } catch (error: any) {
      console.error('Failed to update exam:', error);
      alert(error.message || 'Failed to update exam. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Exam not found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Exams
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Exam</h1>
        <div className="w-20"></div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <CreateExamForm 
          initialData={exam}
          onSubmit={handleSubmit}
          isEdit={true}
          loading={saving}
        />
      </div>
    </div>
  );
};
