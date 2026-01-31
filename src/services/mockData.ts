import { Package, Class, Stream, Subject, Order } from './packageApi';

export const mockClasses: Class[] = [
  { id: 11, name: 'Class 11', is_active: true },
  { id: 12, name: 'Class 12', is_active: true },
  { id: 10, name: 'Class 10', is_active: true },
];

export const mockStreams: Stream[] = [
  { id: 1, name: 'Science', class_id: 11, is_active: true },
  { id: 2, name: 'Commerce', class_id: 11, is_active: true },
  { id: 3, name: 'Arts', class_id: 11, is_active: true },
  { id: 4, name: 'Science', class_id: 12, is_active: true },
  { id: 5, name: 'Commerce', class_id: 12, is_active: true },
];

export const mockSubjects: Subject[] = [
  // Subjects for Class 11 Science (stream_id: 1)
  { id: 1, name: 'Physics', stream_id: 1, is_active: true },
  { id: 2, name: 'Chemistry', stream_id: 1, is_active: true },
  { id: 3, name: 'Mathematics', stream_id: 1, is_active: true },
  { id: 4, name: 'Biology', stream_id: 1, is_active: true },
  
  // Subjects for Class 11 Commerce (stream_id: 2)
  { id: 5, name: 'Accountancy', stream_id: 2, is_active: true },
  { id: 6, name: 'Business Studies', stream_id: 2, is_active: true },
  { id: 7, name: 'Economics', stream_id: 2, is_active: true },
  
  // Subjects for Class 11 Arts (stream_id: 3)
  { id: 8, name: 'History', stream_id: 3, is_active: true },
  { id: 9, name: 'Geography', stream_id: 3, is_active: true },
  { id: 10, name: 'Political Science', stream_id: 3, is_active: true },
  
  // Subjects for Class 12 Science (stream_id: 4)
  { id: 11, name: 'Physics - Class 12', stream_id: 4, is_active: true },
  { id: 12, name: 'Chemistry - Class 12', stream_id: 4, is_active: true },
  { id: 13, name: 'Mathematics - Class 12', stream_id: 4, is_active: true },
  { id: 14, name: 'Biology - Class 12', stream_id: 4, is_active: true },
  
  // Subjects for Class 12 Commerce (stream_id: 5)
  { id: 15, name: 'Accountancy - Class 12', stream_id: 5, is_active: true },
  { id: 16, name: 'Business Studies - Class 12', stream_id: 5, is_active: true },
  { id: 17, name: 'Economics - Class 12', stream_id: 5, is_active: true },
];

export const mockPackages: Package[] = [
  {
    id: 1,
    package_name: 'Class 11 Physics Complete',
    package_type: 'subject',
    description: 'Complete Physics course for Class 11 with video lectures, notes, and practice tests',
    price: 1999,
    duration_months: 12,
    is_active: true,
    class_id: 11,
    stream_id: 1,
    subject_id: 1,
  },
  {
    id: 2,
    package_name: 'Class 11 Chemistry Complete',
    package_type: 'subject',
    description: 'Complete Chemistry course for Class 11 with video lectures, notes, and practice tests',
    price: 1999,
    duration_months: 12,
    is_active: true,
    class_id: 11,
    stream_id: 1,
    subject_id: 2,
  },
  {
    id: 3,
    package_name: 'Class 11 Mathematics Complete',
    package_type: 'subject',
    description: 'Complete Mathematics course for Class 11 with video lectures, notes, and practice tests',
    price: 2499,
    duration_months: 12,
    is_active: true,
    class_id: 11,
    stream_id: 1,
    subject_id: 3,
  },
  {
    id: 4,
    package_name: 'Class 11 Science Stream',
    package_type: 'stream',
    description: 'Complete Science stream package for Class 11 with all subjects',
    price: 5999,
    duration_months: 12,
    is_active: true,
    class_id: 11,
    stream_id: 1,
  },
  {
    id: 5,
    package_name: 'JEE Test Series',
    package_type: 'test_series',
    description: 'Complete JEE test series with mock tests and previous year papers',
    price: 2999,
    duration_months: 6,
    is_active: true,
  },
  {
    id: 6,
    package_name: 'Class 11 Commerce Stream',
    package_type: 'stream',
    description: 'Complete Commerce stream package for Class 11 with all subjects',
    price: 4999,
    duration_months: 12,
    is_active: true,
    class_id: 11,
    stream_id: 2,
  },
];

export const mockOrders: Order[] = [
  {
    id: 123,
    student_id: 456,
    total_amount: 1999,
    status: 'paid',
    payment_status: 'paid',
    transaction_id: 'txn_1234567890',
    payment_gateway: 'razorpay',
    created_at: new Date('2024-01-15T10:30:00Z').toISOString(),
    updated_at: new Date('2024-01-15T10:35:00Z').toISOString(),
    order_items: [
      {
        id: 1,
        order_id: 123,
        package_id: 1,
        price: 1999,
        package: {
          id: 1,
          package_name: 'Class 11 Physics Complete',
          package_type: 'subject',
          description: 'Complete Physics course for Class 11',
        },
      },
    ],
  },
  {
    id: 124,
    student_id: 456,
    total_amount: 5999,
    status: 'pending',
    payment_status: 'pending',
    created_at: new Date('2024-01-16T14:20:00Z').toISOString(),
    updated_at: new Date('2024-01-16T14:20:00Z').toISOString(),
    order_items: [
      {
        id: 2,
        order_id: 124,
        package_id: 4,
        price: 5999,
        package: {
          id: 4,
          package_name: 'Class 11 Science Stream',
          package_type: 'stream',
          description: 'Complete Science stream package for Class 11',
        },
      },
    ],
  },
];
