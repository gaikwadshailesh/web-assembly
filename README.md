# WebTechFusion

A full-stack web application showcasing modern web technologies with real-time data visualization, WebAssembly computation, and multi-user video chat capabilities.

## 🌟 Features

### 1. GitHub Users Data Table
- Real-time data fetching from GitHub API
- Interactive search functionality
- Data visualization with charts:
  - User type distribution (Pie Chart)
  - Followers distribution (Bar Chart)
- Auto-refresh every 60 seconds

### 2. WebAssembly Integration
- High-performance factorial calculations
- Performance comparison between WebAssembly and JavaScript
- Real-time performance visualization
- Interactive input handling

### 3. Multi-User Video Chat
- Room-based video communication
- Real-time audio/video streaming
- Multiple participant support
- Room creation and joining functionality

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI framework
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Recharts** - Data visualization
- **WebRTC** - Video chat functionality
- **WebAssembly** - High-performance computing

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **WebSocket** - Real-time communication
- **PostgreSQL** - Database (optional)

## 🏗️ Architecture

```
Client (React)                 Server (Node.js)
┌──────────────┐              ┌──────────────┐
│   UI Layer   │◄────REST────►│   Express    │
│  Components  │              │    Server    │
└──────┬───────┘              └──────┬───────┘
       │                             │
┌──────┴───────┐              ┌──────┴───────┐
│  Data Layer  │◄───WebRTC───►│   WebRTC     │
│   Services   │              │   Signaling   │
└──────┬───────┘              └──────┬───────┘
       │                             │
┌──────┴───────┐              ┌──────┴───────┐
│  WebAssembly │              │   Database   │
│   Modules    │              │  (Optional)  │
└──────────────┘              └──────────────┘
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20 or later
- Git
- GitHub Personal Access Token (for API access)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/WebTechFusion.git
cd WebTechFusion
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Create a .env file in the client directory
cp client/.env.example client/.env
```

Add your GitHub token to the `.env` file:
```
VITE_GITHUB_TOKEN=your_github_token_here
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🔧 Development Guidelines

### Code Structure
- `/client` - Frontend React application
- `/server` - Backend Express server
- `/wasm` - WebAssembly modules
- `/db` - Database schemas and configurations

### Key Components
- `DataTable.tsx` - GitHub users table with real-time updates
- `WebAssembly.tsx` - WebAssembly factorial calculator
- `VideoChat.tsx` - Video chat implementation

### Best Practices
- Use React Query for data fetching
- Implement proper error handling
- Follow the component structure
- Use Tailwind CSS for styling
- Leverage shadcn/ui components

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
