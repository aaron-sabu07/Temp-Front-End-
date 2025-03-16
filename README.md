# Multilingual AI Chatbot

A modern React-based chatbot interface that supports multiple languages. Built with React, TypeScript, and Chakra UI.

## Features

- 🌐 Support for multiple languages with Sarvam AI Translation API
- 💬 Real-time chat interface
- 🎨 Modern and elegant design
- ⚡ Fast and responsive
- 🔌 Ready for backend integration
- 🔄 Dynamic translation of all UI elements

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Sarvam AI API subscription key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chatbot
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Sarvam AI API subscription key to the `.env` file:
   ```
   VITE_SARVAM_API_KEY=your_sarvam_api_key_here
   ```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Translation Feature

This chatbot uses the Sarvam AI Translation API to provide real-time translation of all UI elements. When a user selects a language from the dropdown menu, all visible text on the page (sidebar items, chatbot content, custom text, etc.) is translated into that language.

### Supported Languages

- English (en-IN)
- Hindi (hi-IN)
- Bengali (bn-IN)
- Gujarati (gu-IN)
- Kannada (kn-IN)
- Malayalam (ml-IN)
- Marathi (mr-IN)
- Odia (od-IN)
- Punjabi (pa-IN)
- Tamil (ta-IN)
- Telugu (te-IN)

### How It Works

1. The application uses i18next for basic internationalization
2. When a language is selected, the Sarvam AI Translation API is called to translate all text
3. The UI is updated with the translated text in real-time
4. Chat messages are also translated when the language is changed

## Building for Production

To create a production build:

```bash
npm run build
```

## Project Structure

```
src/
  ├── assets/        # Static assets
  ├── components/    # React components
  │   ├── Chat.tsx   # Main chat interface
  │   ├── TranslatedText.tsx # Component for dynamic text translation
  │   └── TranslationProvider.tsx # Context provider for translations
  ├── hooks/         # Custom React hooks
  │   └── useSarvamTranslation.ts # Hook for Sarvam translation integration
  ├── i18n/          # Internationalization
  ├── theme/         # Chakra UI theme
  ├── types/         # TypeScript types
  └── utils/         # Utility functions
      └── translationService.ts # Service for Sarvam API integration
```

## Tech Stack

- React
- TypeScript
- Chakra UI
- Vite
- i18next
- React Icons
- Axios (for API calls)
- Sarvam AI Translation API

## Future Enhancements

- [ ] Backend integration with Flask
- [ ] Database integration
- [ ] API integrations
- [x] More language support with Sarvam AI
- [ ] Voice input/output
- [ ] File sharing capabilities
