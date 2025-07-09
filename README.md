# 📱 TrackMate – Habit Tracker App

TrackMate is a beautifully designed mobile habit tracker app built with React Native, Expo, and React Native Paper, with Appwrite powering the backend. TrackMate helps users build better habits, stay consistent, and achieve their personal growth goals with ease.

##

### 🚀 Features :

- ✅ Add, edit, and delete habits.

- 🗓️ Add habits based on frequency (Daily, Weekly, Monthly).

- 📊 Visual indicators for completion.   

- 🔐 Secure authentication using Appwrite.

- 🧠 Minimalistic and intuitive UI using React Native Paper.

##

### 🛠️ Tech Stack :

| Tech                   | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| **React Native**       | Core UI framework for building the mobile app        |
| **Expo**               | Fast development and deployment workflow             |
| **React Native Paper** | Material Design UI components                        |
| **Appwrite**           | Backend-as-a-Service for authentication and database |
| **TypeScript**         | For type safety                           |

##

### 📂 Folder Structure :

```bash
TrackMate/
├── app/
│   ├── (tabs)/           # Main tab layout
│   ├── add-habit/        # Add habit form
│   ├── profile/          # Profile & account management
│   ├── _layout.tsx       # Layout and navigation
├── components/           # Reusable UI components
├── lib/                  # Appwrite client setup, utils
├── constants/            # Colors, styles, etc.
├── assets/               # Icons, images
├── App.tsx               # Entry point
└── README.md
```

##

### 🔧 Setup & Installation :

1. Clone the repository.
```bash
git clone https://github.com/your-username/trackmate.git
cd trackmate
```

2. Install dependencies.
```bash
npm install
# or
yarn install
```

3. Configure Appwrite

   - Create an Appwrite project.
   - Enable authentication and database.
   - Add your Appwrite endpoint and project ID in a config file (e.g., lib/appwrite.ts).
   - Add environment variables if necessary.

4. Start the app
```bash
npx expo start
```

##

### 🔒 Environment Variables :
Create a `.env` file in the root directory and add your Appwrite config :

```bash
EXPO_PUBLIC_APPWRITE_API_ENDPOINT=
EXPO_PUBLIC_APPWRITE_PROJECT_ID=
EXPO_PUBLIC_APPWRITE_PLATFORM=

EXPO_PUBLIC_DB_ID=
EXPO_PUBLIC_HABITS_COLLECTION_ID=
EXPO_PUBLIC_COMPLETION_COLLECTION_ID=
```

##

### 🧠 Future Improvements :

- Notifications for missed habits
- Streak calendar view
- Analytics dashboard
- Cloud sync across devices
- Offline support

##

### 🧑‍💻 Author :

Made with 💚 by Amith B V