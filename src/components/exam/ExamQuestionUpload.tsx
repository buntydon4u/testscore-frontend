import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

type UploadSectionSummary = {
  sectionId: string;
  subjectId?: string;
  name?: string;
  totalQuestions?: number;
  totalMarks?: number;
};

type UploadResult = {
  message?: string;
  mode?: 'SUBJECT_WISE' | 'COMBINED';
  sectionId?: string;
  totalQuestions: number;
  totalMarks: number;
  sections?: UploadSectionSummary[];
};

interface ExamQuestionUploadProps {
  examId: string;
  defaultSectionName?: string;
  sampleFileUrl?: string;
  subjectWiseSampleFileUrl?: string;
}

export const ExamQuestionUpload = ({
  examId,
  defaultSectionName = 'Combined Paper',
  sampleFileUrl = '/sample-exam-questions.xlsx',
  subjectWiseSampleFileUrl = '/sample-exam-questions-subject-wise.xlsx',
}: ExamQuestionUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [sectionName, setSectionName] = useState(defaultSectionName);
  const [questionBankId, setQuestionBankId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select an .xlsx file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    if (sectionName) formData.append('sectionName', sectionName);
    if (questionBankId) formData.append('questionBankId', questionBankId);

    setLoading(true);
    setResult(null);

    try {
      const accessToken = localStorage.getItem('accessToken');
      const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';
      const res = await axios.post<UploadResult>(
        `${apiBaseUrl}/exams/${examId}/upload-questions`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
        }
      );
      setResult(res.data);
      if (res.data.mode === 'SUBJECT_WISE') {
        const sectionCount = res.data.sections?.length || 0;
        toast.success(
          `Uploaded ${res.data.totalQuestions} questions (${res.data.totalMarks} marks) across ${sectionCount} sections`
        );
      } else {
        toast.success(
          `Uploaded ${res.data.totalQuestions} questions (${res.data.totalMarks} marks)`
        );
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Upload failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Upload Questions (Excel)</h2>
        <div className="flex items-center gap-3 text-sm font-medium">
          <a
            href={sampleFileUrl}
            download
            className="text-emerald-600 hover:text-emerald-700"
          >
            Download Sample Excel
          </a>
          <a
            href={subjectWiseSampleFileUrl}
            download
            className="text-emerald-600 hover:text-emerald-700"
          >
            Download Subject-Wise Sample Excel
          </a>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        To upload subject-wise papers, include subject_id in every row.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Name
          </label>
          <input
            type="text"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Combined Paper"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Bank ID (optional)
          </label>
          <input
            type="text"
            value={questionBankId}
            onChange={(e) => setQuestionBankId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="qb_123..."
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Excel File (.xlsx)
          </label>
          <input
            type="file"
            accept=".xlsx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || loading}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
        {result && (
          <div className="text-sm text-gray-700">
            {result.message && <div className="font-medium">{result.message}</div>}
            <div>Total Questions: {result.totalQuestions}</div>
            <div>Total Marks: {result.totalMarks}</div>
            {result.mode === 'SUBJECT_WISE' && result.sections && (
              <div className="mt-2 text-xs text-gray-500">
                Sections created: {result.sections.length}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
