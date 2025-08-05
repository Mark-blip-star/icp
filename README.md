# ICP - LinkedIn Automation Platform

A comprehensive LinkedIn automation platform with both frontend (Next.js) and backend (NestJS) components.

## Project Structure

```
icp-main/
├── icptiger/                 # Frontend (Next.js)
│   ├── app/                 # Next.js app directory
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utility libraries
│   └── public/              # Static assets
└── icptiger-automation-nestjs/  # Backend (NestJS)
    ├── src/                 # Source code
    ├── test/                # Tests
    └── package.json         # Dependencies
```

## Features

### Frontend (Next.js)
- Modern React-based UI with TypeScript
- Authentication system
- Dashboard for campaign management
- LinkedIn integration interface
- Real-time status updates
- Responsive design

### Backend (NestJS)
- RESTful API endpoints
- LinkedIn automation services
- Job queue processing
- WebSocket support for real-time updates
- Database integration with Supabase
- Campaign management

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd icptiger
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd icptiger-automation-nestjs
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Run the development server:
```bash
npm run start:dev
```

The backend API will be available at `http://localhost:3001`

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (.env)
```
DATABASE_URL=your_database_url
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
JWT_SECRET=your_jwt_secret
```

## Development

### Running Both Services

You can run both frontend and backend simultaneously using:

```bash
# Terminal 1 - Frontend
cd icptiger && npm run dev

# Terminal 2 - Backend
cd icptiger-automation-nestjs && npm run start:dev
```

### Building for Production

#### Frontend
```bash
cd icptiger
npm run build
npm start
```

#### Backend
```bash
cd icptiger-automation-nestjs
npm run build
npm run start:prod
```

## API Documentation

The backend provides RESTful APIs for:
- Authentication
- Campaign management
- LinkedIn automation
- User settings
- Real-time updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary software.

## Support

For support and questions, please contact the development team. 