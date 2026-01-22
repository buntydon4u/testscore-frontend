# Educational Platform Package Management Frontend

This frontend application provides a comprehensive interface for managing educational packages, orders, and student access based on the provided API specification.

## Features

### 🎯 Package Management
- **Create, Read, Update, Delete** packages with different types (class, subject, stream, test_series, chapter)
- **Advanced filtering** by package type, price range, status, class, stream, and subject
- **Dynamic form validation** based on package type requirements
- **Real-time package listing** with search and pagination

### 💳 Order Management
- **Create orders** with multiple packages
- **Track order status** (pending, paid, failed, refunded)
- **Payment status management** for admins
- **Order history** for students
- **Transaction tracking** with payment gateway integration

### 📊 Admin Dashboard
- **Real-time statistics** with charts and graphs
- **Order analytics** with date range filtering
- **Revenue tracking** and order status breakdown
- **Interactive visualizations** using Recharts

### 👥 Student Access
- **Browse available packages** with detailed information
- **Purchase packages** with order creation
- **View purchased packages** with access status
- **Track order history** and payment status

## Project Structure

```
src/
├── components/
│   ├── Packages/
│   │   ├── PackageList.tsx      # Package listing with filters
│   │   └── PackageForm.tsx      # Create/Edit package form
│   ├── Orders/
│   │   ├── OrderList.tsx        # Order listing and management
│   │   └── CreateOrder.tsx      # Create new order interface
│   └── Navigation/
│       ├── AdminNav.tsx         # Admin navigation menu
│       └── StudentNav.tsx       # Student navigation menu
├── services/
│   ├── packageApi.ts            # Package API service
│   ├── orderApi.ts              # Order API service
│   ├── api.ts                   # Base API client
│   └── auth.ts                  # Authentication service
├── pages/
│   ├── PackageManagement.tsx    # Package management page
│   ├── OrderManagement.tsx      # Order management page
│   ├── AdminDashboard.tsx       # Admin dashboard with stats
│   └── StudentPackages.tsx      # Student package view
└── App.tsx                      # Main routing configuration
```

## API Integration

The frontend integrates with the following API endpoints:

### Package Management
- `GET /packages` - List packages with filtering
- `GET /packages/{id}` - Get package details
- `POST /packages` - Create new package
- `PUT /packages/{id}` - Update package
- `DELETE /packages/{id}` - Delete package
- `GET /packages/classes/list` - Get classes
- `GET /packages/streams/list` - Get streams
- `GET /packages/subjects/list` - Get subjects

### Order Management
- `POST /orders` - Create order
- `GET /orders/{id}` - Get order details
- `GET /orders/student/{id}` - Get student orders
- `PUT /orders/{id}/payment` - Update payment status
- `POST /orders/webhook/payment` - Payment webhook

### Student Access
- `GET /packages/student/{id}/packages` - Get student packages
- `GET /packages/student/{id}/access/{packageId}` - Check access

### Admin Statistics
- `GET /orders/stats/admin` - Get order statistics

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your API URL
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000/api
NODE_ENV=development
```

## Usage

### Admin Role
- Access `/admin/dashboard` for comprehensive statistics
- Manage packages at `/admin/packages`
- Handle orders at `/admin/orders`
- View and update payment statuses

### Student Role
- Browse packages at `/student/packages`
- Create orders and track purchases
- View order history and transaction details

### Authentication
- Login with JWT tokens
- Role-based access control
- Automatic token refresh
- Secure API communication

## Key Components

### PackageList Component
- Advanced filtering system
- Real-time search
- Responsive design
- Bulk operations support

### PackageForm Component
- Dynamic field validation
- Type-specific requirements
- Real-time form validation
- User-friendly error handling

### OrderList Component
- Status-based filtering
- Payment management
- Transaction tracking
- Interactive status updates

### AdminDashboard Component
- Real-time statistics
- Interactive charts
- Date range filtering
- Comprehensive analytics

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Heroicons** - Icons
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Recharts** - Data visualization

## Features Highlights

### 🎨 Modern UI/UX
- Clean, responsive design
- Intuitive navigation
- Real-time feedback
- Loading states and error handling

### 🔒 Security
- JWT-based authentication
- Role-based access control
- Secure API communication
- Input validation and sanitization

### 📱 Responsive Design
- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interfaces
- Adaptive layouts

### ⚡ Performance
- Optimized API calls
- Efficient state management
- Lazy loading
- Caching strategies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
