# 🎓 Modern LMS Platform

A full-stack Learning Management System built with Next.js 14, TypeScript, and modern web technologies. This platform provides comprehensive training management with advanced presentation and video integration capabilities.

## 🚀 Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom Google OAuth
- **Calendar**: react-big-calendar
- **Video Player**: react-player
- **Presentations**: Google Slides & PowerPoint Integration

## ✨ Key Features

- 📅 **Calendar View** - Interactive training session scheduling
- 📊 **Advanced PPT Integration** - Google Slides & PowerPoint support
- 🎥 **Video Integration** - Upload and URL-based video content
- 🔍 **Advanced Filtering** - Comprehensive training search and filtering
- 🔐 **Google Authentication** - Secure OAuth-based login
- 👥 **Role-based Access Control** - Viewer, Content Admin, and Admin roles
- 📱 **Responsive Design** - Mobile-friendly interface

## 📚 Documentation

- **[PPT Integration Guide](./PPT_INTEGRATION.md)** - Comprehensive documentation for presentation features
- **Setup Instructions** - See below for installation and configuration

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Google OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd git-lms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file with the following variables:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/lms_db"

   # NextAuth.js
   APP_URL="http://localhost:3000"
   JWT_SECRET="your-secret-key"

   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Create Admin User**
   ```bash
   npm run setup:admin "Admin Name" "admin@example.com"
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── training/          # Training content pages
│   └── ...
├── components/            # Reusable React components
│   ├── FileViewer.tsx    # Generic file viewer
│   ├── PresentationViewer.tsx  # PPT presentation viewer
│   ├── VideoPlayer.tsx   # Video player component
│   └── ...
├── lib/                   # Utility libraries and configurations
│   ├── auth.ts           # Authentication utilities
│   ├── prisma.ts         # Database client
│   └── ...
├── types/                # TypeScript type definitions
├── utils/                # Helper functions
│   ├── pptUtils.ts       # PPT integration utilities
│   └── videoUtils.ts     # Video processing utilities
└── ...
```

## 🔐 Authentication & Roles

### User Roles

- **Viewer**: Can view training content and calendar
- **Content Admin**: Can manage training content + view content
- **Admin**: Full access (manage users + content)

### Login Flow

1. User clicks "Continue with Google"
2. Google OAuth redirects back to app
3. System checks if user email exists in database
4. If authorized: Login successful, redirect to dashboard
5. If not authorized: Show "Access not granted" message

## 📊 PPT Integration Features

The platform includes advanced presentation integration:

- **Google Slides**: Full embedded viewing with navigation
- **Google Drive PowerPoint**: Preview and download support
- **Direct PowerPoint**: Download support for .ppt/.pptx files
- **Slideshow Mode**: Auto-advance presentation viewing
- **Fullscreen Support**: Enhanced viewing experience

📖 **For detailed PPT integration documentation, see [PPT_INTEGRATION.md](./PPT_INTEGRATION.md)**

## 🎥 Video Features

- **Multiple Sources**: Upload files or use external URLs
- **Player Controls**: Play, pause, seek, volume control
- **Responsive Design**: Works on all device sizes
- **Format Support**: MP4, WebM, and other web-compatible formats

## 🗄️ Database Schema

### Core Models

- **User**: Authentication and role management
- **Training**: Training content and metadata
- **Account**: OAuth account linking
- **Session**: User session management

### Role System

```typescript
enum Role {
  viewer = "viewer"
  contentAdmin = "contentAdmin"
  admin = "admin"
}
```

## 🚀 Deployment

### Environment Variables

Ensure all required environment variables are set in production:

- `DATABASE_URL` - PostgreSQL connection string
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `JWT_SECRET` - JWT signing secret
- `APP_URL` - Application URL

### Database Migration

```bash
npx prisma generate
npx prisma db push
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔧 Development Scripts

```bash
# Setup admin user
npm run setup:admin "Name" "email@example.com"

# Database operations
npx prisma generate
npx prisma db push
npx prisma studio

# Development
npm run dev
npm run build
npm run start
```

## 📞 Support

For questions or issues, please refer to the documentation or create an issue in the repository.
