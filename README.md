# Rally Rank

A mobile application for managing tennis ladder leagues, tracking matches, and ranking players using an ELO-based rating system.

## Overview

Rally Rank allows tennis players to:
- Join or create tennis ladder leagues
- Record match results with detailed scoring
- Track rankings based on an ELO rating system
- View match history and player statistics
- Authenticate via Apple or Google OAuth

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Expo](https://expo.dev/) (SDK 54) with [Expo Router](https://docs.expo.dev/router/introduction/) |
| **Language** | TypeScript |
| **UI** | React Native |
| **Backend** | [Appwrite](https://appwrite.io/) (Cloud) |
| **Authentication** | Appwrite OAuth (Apple, Google) + Email/Password |
| **State Management** | React Context API |
| **Forms** | React Hook Form |
| **Build/Deploy** | EAS Build + TestFlight/App Store |

## Project Structure

```
RallyRank/
├── app/                      # Expo Router file-based routing
│   ├── _layout.tsx           # Root layout with GlobalProvider
│   ├── index.tsx             # Entry point / redirect
│   ├── (auth)/               # Authentication screens (unauthenticated)
│   │   ├── sign-in.tsx       # Login screen
│   │   ├── sign-up.tsx       # Registration screen
│   │   ├── CreateLadder.tsx  # Create new ladder
│   │   └── _layout.tsx
│   └── (drawer)/(tabs)/      # Main app screens (authenticated)
│       ├── index.tsx         # Match Feed (home)
│       ├── LadderStandings.tsx
│       ├── EnterScore.tsx
│       ├── Profile.tsx
│       ├── NoLeague.tsx      # Shown when user has no league
│       ├── JoinLadder.tsx
│       └── _layout.tsx       # Tab navigation config
├── components/               # Reusable components
│   ├── auth/                 # Auth-related components
│   │   └── ExternalButtons.tsx  # OAuth buttons (Apple/Google)
│   ├── Profile.tsx           # Profile component
│   ├── OnBoardingFlow.tsx
│   └── ui/                   # UI primitives
├── lib/                      # Core libraries and services
│   ├── appwrite.ts           # Appwrite SDK configuration & API functions
│   ├── globalprovider.tsx    # Global state context
│   ├── useAppwrite.ts        # Custom hook for Appwrite calls
│   └── geolocationApi.ts     # Location services
├── constants/                # App constants
│   ├── Colors.ts
│   ├── styles.ts             # Shared styles
│   └── theme.ts
├── assets/                   # Images, fonts, icons
├── app.json                  # Expo configuration
├── eas.json                  # EAS Build configuration
└── package.json
```

## Architecture

### Navigation Flow

```
App Start
    │
    ▼
┌─────────────────────┐
│   GlobalProvider    │  ← Fetches current user from Appwrite
│   (Auth State)      │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐     ┌─────────────────────┐
│   isLoggedIn?       │────▶│   (auth) Stack      │
│                     │ No  │   - sign-in         │
│                     │     │   - sign-up         │
└─────────────────────┘     └─────────────────────┘
    │ Yes
    ▼
┌─────────────────────┐     ┌─────────────────────┐
│  isLeagueMember?    │────▶│   NoLeague Screen   │
│                     │ No  │   - JoinLadder      │
└─────────────────────┘     └─────────────────────┘
    │ Yes
    ▼
┌─────────────────────┐
│   Main Tabs         │
│   - Match Feed      │
│   - Ladder Standings│
│   - Enter Score     │
│   - Profile         │
└─────────────────────┘
```

### State Management

The app uses React Context for global state:

```typescript
GlobalContext {
  isLoggedIn: boolean      // Auth status
  user: User | null        // Current user data + league membership
  loading: boolean         // Loading state
  refetch: () => void      // Refresh user data
}
```

### Data Model (Appwrite Collections)

| Collection | Description |
|------------|-------------|
| **Players** | User profiles (name, email, location, etc.) |
| **Leagues** | Ladder leagues (name, code, location) |
| **Members** | League memberships (player, league, rank, rating) |
| **Matches** | Match results (players, scores, winner, date) |

### Ranking System

Rally Rank uses an **ELO rating system**:
- New players start at **1400**
- K-factor: **32**
- After each match, ratings are adjusted based on expected vs actual outcome
- Rankings within a league are ordered by rating value

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- iOS Simulator (macOS) or Android Emulator
- Appwrite account with project configured

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd RallyRank

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your Appwrite credentials
```

### Environment Variables

Create a `.env.local` file with:

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
EXPO_PUBLIC_APPWRITE_PLAYER_COLLECTION_ID=your-player-collection-id
EXPO_PUBLIC_APPWRITE_MEMBER_COLLECTION_ID=your-member-collection-id
EXPO_PUBLIC_APPWRITE_MATCH_COLLECTION_ID=your-match-collection-id
EXPO_PUBLIC_APPWRITE_LEAGUE_COLLECTION_ID=your-league-collection-id
EXPO_PUBLIC_APPWRITE_STORAGE_ID=your-storage-id
```

### Running the App

```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### Building for Production

```bash
# Build for iOS (TestFlight)
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production

# Submit to App Store
eas submit --platform ios
```

**Note:** For production builds, environment variables must be configured in `eas.json` under the `env` key or via EAS Secrets (`eas secret:create`).

## Appwrite Setup

### Required Platforms

In Appwrite Console → Settings → Platforms, add:

| Platform | Bundle ID / Package |
|----------|---------------------|
| iOS | `com.tennisapp.app` |
| Android | `com.tennisapp.app` |

### OAuth Configuration

1. **Apple Sign In**: Configure in Appwrite Console → Auth → Apple
2. **Google Sign In**: Configure in Appwrite Console → Auth → Google

Ensure the OAuth redirect scheme matches: `appwrite-callback-<PROJECT_ID>`

### Database Collections

Create the following collections with appropriate attributes and permissions:

1. **Players**: `name`, `email`, `PhoneNumber`, `City`, `County`, `State`, `Country`, `DeviceType`
2. **Leagues**: `Name`, `Description`, `LadderCode`, `CreateDate`, `City`, `County`, `State`, `Country`
3. **Members**: `player` (relation), `league` (relation), `rank`, `rating_value`, `wins`, `losses`
4. **Matches**: `league` (relation), `player_id1` (relation), `player_id2` (relation), scores, `winner`, `MatchDate`

## License

Private - All rights reserved

## Contact

For questions or testing access, contact: eric@rally-rank.com
