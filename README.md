# Claude Chat

A modern React application for chatting with the Claude API. Built with Vite, TypeScript, and Tailwind CSS.

## Features

- **Chat Interface**: Clean, modern chat interface with message history
- **Model Selection**: Choose between Claude Sonnet 4.5, Opus 4.5, and Haiku 3.5
- **Token Usage**: Real-time token counter and cost estimator
- **Dark Mode**: Toggle between light and dark themes
- **Markdown Support**: Full markdown rendering for assistant responses
- **Copy Messages**: Copy any message to clipboard with one click
- **Export Conversations**: Export chat history as JSON or Markdown
- **Persistent Storage**: API key and conversations saved to localStorage
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: User-friendly error messages for API issues

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- An Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd claude-chat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

5. Enter your Anthropic API key in the header input field

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Enter API Key**: Input your Anthropic API key in the header. It will be saved to localStorage for future sessions.

2. **Select Model**: Choose your preferred Claude model from the dropdown:
   - **Claude Sonnet 4.5**: Balanced performance and cost
   - **Claude Opus 4.5**: Most capable model
   - **Claude Haiku 3.5**: Fastest and most affordable

3. **Start Chatting**: Type your message and press Enter or click the send button.

4. **View Token Usage**: The token counter shows input/output tokens and estimated cost.

5. **Export Conversation**: Click the download button to export as JSON or Markdown.

6. **Clear Conversation**: Click the trash button to start a new conversation.

7. **Toggle Dark Mode**: Click the sun/moon button to switch themes.

## Project Structure

```
src/
├── components/          # React components
│   ├── ApiKeyInput.tsx
│   ├── ChatInput.tsx
│   ├── ChatWindow.tsx
│   ├── EmptyState.tsx
│   ├── ErrorMessage.tsx
│   ├── Header.tsx
│   ├── MessageBubble.tsx
│   ├── ModelSelector.tsx
│   ├── TokenCounter.tsx
│   ├── TypingIndicator.tsx
│   └── index.ts
├── hooks/               # Custom React hooks
│   ├── useChat.ts
│   └── useDarkMode.ts
├── services/            # API services
│   └── claude.ts
├── types/               # TypeScript types
│   └── index.ts
├── utils/               # Utility functions
│   └── storage.ts
├── App.tsx              # Main app component
├── main.tsx             # App entry point
└── index.css            # Global styles with Tailwind
```

## Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons
- **React Markdown** - Markdown rendering

## API Security Note

This application stores the API key in the browser's localStorage for convenience. While this is acceptable for personal/development use, consider implementing server-side API key management for production deployments.

## License

MIT
