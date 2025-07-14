# Agora - Investor Relations Event Coordination

A Microsoft Outlook Add-in that simplifies event coordination between **Investor Relations (IR) Teams** and **Investors** (Analyst Managers & Investment Analysts).

## Features

### 🎯 Role-Based Access Control
- **IR Admin**: Create/manage events, view RSVPs, export data
- **Analyst Manager**: View calendar, assign events to analysts, manage RSVPs
- **Investment Analyst**: View assigned events, manage personal RSVPs

### 🌙 Bloomberg-Style Dark Theme
- Dark theme by default with light mode toggle
- Clean, minimal, data-dense layouts
- High contrast for professional use

### 📊 Analytics Dashboard
- Real-time event and RSVP statistics
- Engagement rate tracking
- Role-specific metrics and insights

### 🗃️ Local-First Database
- In-memory database with TypeScript types
- Comprehensive seed data for testing
- Real-time data synchronization

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS with custom Bloomberg theme
- **Icons**: Lucide React
- **Data**: In-memory TypeScript database
- **Charts**: Recharts (ready for implementation)
- **CSV**: Papaparse (ready for implementation)
- **Routing**: Simple hash-based routing

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd agora-outlook-addin
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

### Sample Login Credentials

#### IR Admins (Password: `admin`)
- `ir.admin@apple.com`
- `ir.admin@microsoft.com`
- `ir.admin@tesla.com`

#### Analysts (Password: `user`)
- `spencer.beasley@bloomberg.com` (Manager)
- `deborah.drake@bloomberg.com` (Analyst)
- `ewan.martinez@bloomberg.com` (Analyst)
- `clyde.nelson@bloomberg.com` (Analyst)

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx   # Role-based dashboard
│   ├── Layout.tsx      # Main layout with navigation
│   └── LoginPage.tsx   # Authentication page
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state
│   └── ThemeContext.tsx # Theme management
├── services/           # Business logic
│   ├── auth.ts        # Authentication service
│   └── database.ts    # In-memory database
├── types/             # TypeScript definitions
│   └── index.ts       # All type definitions
└── styles/
    └── index.css      # TailwindCSS styles
```

## Database Schema

### Core Entities
- **Users**: Authentication and role management
- **Companies**: IR companies and analyst firms
- **Events**: Meeting and event data
- **RSVPs**: Response tracking
- **AnalystAssignments**: Event assignments by managers
- **FollowedCompanies**: User company preferences

### Sample Data
- 7 users across 3 roles
- 5 companies (3 IR, 2 Analyst)
- 5 events with assignments and RSVPs
- Complete relationship data for testing

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Roadmap

### Phase 1: Core Features (Complete)
- ✅ Authentication system
- ✅ Role-based navigation
- ✅ Dashboard with analytics
- ✅ Dark/light theme toggle
- ✅ Responsive design

### Phase 2: Advanced Features (Planned)
- 📅 Interactive calendar view
- 📋 Event CRUD operations
- 📊 Advanced analytics with charts
- 📄 CSV import/export
- 🔍 Advanced filtering and search

### Phase 3: Integration (Planned)
- 🔗 Microsoft Outlook integration
- 🌐 Real-time synchronization
- 📱 Mobile optimization
- 🔐 Enterprise authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or support, please contact the development team.
