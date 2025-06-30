# Inline Trailer Implementation for Movie Chatbot

## Overview
This implementation adds inline trailer video support to the movie chatbot. When the chatbot API returns movie data with trailer information, the videos are displayed inline in the chat conversation.

## Components Added/Modified

### 1. **TrailerModel** (`src/app/shared/models/trailer.model.ts`)
- New interface for trailer data structure
- Contains properties: key, name, site, type, official, youTubeUrl, embedUrl, thumbnailUrl

### 2. **TmdbMovieModel** (`src/app/shared/models/tmdb-movie.model.ts`)
- Updated to include optional `trailer` property
- Made properties flexible to support both camelCase and snake_case API responses

### 3. **InlineTrailerComponent** (`src/app/movie/inline-trailer/inline-trailer.component.ts`)
- Standalone component for displaying trailer videos
- Features:
  - Small inline video player (180px height)
  - Click to expand to fullscreen mode (400px height)
  - Hover overlay with expand hint
  - Close button and YouTube link in fullscreen mode
  - Responsive design with proper styling

### 4. **MovieChatbotContentComponent** (`src/app/movie/movie-chatbot-content/movie-chatbot-content.component.ts`)
- Updated to display trailers when available in movie responses
- Shows trailer intro text: "🎬 Here's the trailer for [Movie Title]:"
- Integrates InlineTrailerComponent for each movie with trailer data

### 5. **TrailerDemoComponent** (`src/app/trailer-demo/trailer-demo.component.ts`)
- Demo component to test trailer functionality
- Available at `/trailer-demo` route
- Uses sample Batman trailer data

## Usage Flow

1. User asks chatbot about a movie (e.g., "play the batman trailer")
2. API returns movie data with trailer information
3. Chatbot displays the response text
4. If movie has trailer data, inline video player appears
5. User can click to expand video to fullscreen
6. User can close fullscreen or open in YouTube

## API Response Structure
The chatbot API should return movie data with trailer information:

```json
{
  "funnyFact": "Robert Pattinson learned to play piano for \"The Batman\" scenes himself!",
  "messages": [
    {
      "role": "assistant",
      "text": "Get ready to dive into the dark and gritty world of Gotham...",
      "movieList": [
        {
          "title": "The Batman",
          "trailer": {
            "key": "vc7_mH2PWHs",
            "name": "Official HBO Max Trailer",
            "site": "YouTube",
            "type": "Trailer",
            "official": true,
            "youTubeUrl": "https://www.youtube.com/watch?v=vc7_mH2PWHs",
            "embedUrl": "https://www.youtube.com/embed/vc7_mH2PWHs",
            "thumbnailUrl": "https://img.youtube.com/vi/vc7_mH2PWHs/maxresdefault.jpg"
          }
        }
      ]
    }
  ]
}
```

## Styling Features
- Responsive design that works on mobile and desktop
- Smooth transitions and hover effects
- Consistent with app's color scheme (using #efa21b)
- Proper spacing and typography
- Accessibility considerations (proper ARIA labels)

## Testing
- Access `/trailer-demo` route to see the trailer functionality
- Test with different screen sizes
- Verify YouTube embedding works properly
- Check fullscreen toggle functionality

## Security
- Uses Angular's DomSanitizer to safely handle iframe URLs
- Trusted YouTube embed URLs only
- Proper Content Security Policy considerations for iframe embedding

## Next Steps
1. Test with real API data
2. Add loading states for video embedding
3. Consider adding video autoplay options
4. Add analytics tracking for trailer views
5. Implement error handling for failed video loads
