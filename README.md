# 💰 Finance Flow

A modern, intuitive personal finance management application built with React and Supabase. Track expenses, manage budgets, and gain insights into your spending habits.

![Finance Flow Dashboard](https://img.shields.io/badge/Finance-Flow-blue)
![React](https://img.shields.io/badge/React-18.2+-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase)

## 🚀 Live Demo

👉 **[finance-flow-vone.vercel.app](https://finance-flow-vone.vercel.app)**

## ✨ Features

### 📊 Financial Dashboard
- **Real-time Overview**: Get instant insights into your financial health
- **Income vs Expense Tracking**: Monitor cash flow with visual charts
- **Budget Progress**: Track spending against monthly budgets
- **Recent Transactions**: Quick access to your latest financial activity

### 💳 Transaction Management
- **Add Transactions**: Easy expense and income recording
- **Categorization**: Organize transactions with custom categories
- **Search & Filter**: Find transactions quickly with advanced filtering
- **Bulk Actions**: Manage multiple transactions efficiently

### 📈 Budget Planning
- **Category Budgets**: Set monthly limits for spending categories
- **Progress Tracking**: Visual indicators for budget utilization
- **Overspending Alerts**: Get notified when approaching budget limits
- **Flexible Periods**: Monthly, weekly, or custom budget cycles

### 🔐 Secure Authentication
- **Email Verification**: Secure account confirmation process
- **Password Reset**: Self-service password recovery
- **Session Management**: Secure user sessions with Supabase Auth
- **Remember Me**: Convenient login persistence

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL Database
  - Real-time Subscriptions
  - Row Level Security
  - Authentication
- **Brevo** - Email service for notifications

### Deployment
- **Vercel** - Frontend hosting
- **Supabase** - Backend hosting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/finance-flow.git
   cd finance-flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) to view the app.

### Production Build
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
finance-flow/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── ui/         # Base UI components (Button, Card, etc.)
│   │   └── layout/     # Layout components
│   ├── contexts/       # React contexts (Auth, etc.)
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   │   ├── app/        # Protected app pages
│   │   └── public/     # Public pages (Login, Signup)
│   ├── lib/            # Utility libraries
│   └── App.jsx         # Main app component
├── public/             # Static assets
└── package.json
```

## 🔧 Configuration

### Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Run the following SQL to set up the database schema:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6B7280',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budgets table
CREATE TABLE budgets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  amount DECIMAL(10,2) NOT NULL,
  period TEXT CHECK (period IN ('monthly', 'yearly')) DEFAULT 'monthly',
  spent_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own profiles" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own categories" ON categories FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own transactions" ON transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own budgets" ON budgets FOR ALL USING (auth.uid() = user_id);
```

## 🎨 UI Components

The project uses a custom design system built with Tailwind CSS:

- **Button** - Primary, secondary, and outline variants
- **Card** - Container components with consistent styling
- **Form Elements** - Inputs, selects, and labels
- **Navigation** - Responsive sidebar and top navigation

## 🔒 Security Features

- Row Level Security (RLS) on all database tables
- Secure authentication with Supabase Auth
- Email verification for new accounts
- Password reset functionality
- Protected routes for authenticated users

## 📱 Responsive Design

Fully responsive design that works on:
- 📱 Mobile phones
- 💻 Tablets
- 🖥️ Desktop computers

## 🚀 Deployment

The application is configured for easy deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the amazing backend platform
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Vercel](https://vercel.com) for seamless deployment
- [Lucide](https://lucide.dev) for beautiful icons

---

**Finance Flow** - Take control of your financial future, one transaction at a time. 💫
