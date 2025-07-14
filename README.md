# 🍽😋 DineRate

📄 Project Documentation: https://docs.google.com/document/d/1W4X9eVA9Q5IpPLjczei6R3KohnyaEdRY0KPBzs-iq6g/edit?usp=sharing  
📄 User Story: https://docs.google.com/document/d/1xSLjSf7dwzB2mLF7UVhnWSOh7-C3nv561PlomYQYsFQ/edit?usp=sharing  
📄 Presentation Slide: https://docs.google.com/presentation/d/1EEQ10oYte1v-55WKfstGGSpGmSx8MYTLaVl-BUDt-bc/edit?usp=sharing  
📄 Product Backlog: https://docs.google.com/document/d/1GmRpzB3C9ZOoC-8YAY87VbYj4dz0q1FcRgDMcnN24dI/edit?usp=sharing  
📄 Software Architecture Models: https://docs.google.com/document/d/1h8wXCg4vSrbHAELRN5YaBw80SWi1nlluY5IqDACGV0g/edit?usp=sharing  
📄 Module 6: Sprint Retrospective: https://docs.google.com/document/d/1MbQkiB0ykF_aHopwrtce8XnawwX37eI-hUad5uLwl7k/edit?usp=sharing  
📄 Sprint 1 Presentation: https://docs.google.com/presentation/d/18bzejdqN24Z-qWg7hXyeOIU-y7PUi2-JohPmL0mvQd4/edit?usp=sharing


---

## 🚀 Expo Information

This is an Expo project created with create-expo-app.

### ▶️ Get Started

1. Install dependencies:
   npm install

2. Start the frontend:
   cd client  
   npx expo start

You can run the app on:

- Expo Go
- Android Emulator: https://docs.expo.dev/workflow/android-studio-emulator/
- iOS Simulator: https://docs.expo.dev/workflow/ios-simulator/
- Development Builds: https://docs.expo.dev/develop/development-builds/introduction/

You can start developing by editing files in the app/ directory.

---

## 🛠 Backend Setup

The backend is a Node.js server using Express and MongoDB.

### ✅ 1. Prerequisites

- Node.js installed: https://nodejs.org/
- MongoDB Community Edition: https://www.mongodb.com/try/download/community

### ✅ 2. MongoDB Local Installation (Windows)

1. Download the installer:  
   https://www.mongodb.com/try/download/community

2. During installation:
   - Check "Install MongoDB as a Service"
   - Include MongoDB Compass (optional)

3. After installation:
   - Add MongoDB to system PATH:  
     Go to C:\Program Files\MongoDB\Server\<version>\bin  
     Copy the path, and add it in Environment Variables → Path → New

4. Start MongoDB:
   mongod

5. Create a .env file in the server/ folder:

   MONGO_URI=mongodb://127.0.0.1:27017/dinerate  
   PORT=5000

6. In a second terminal:
   cd server  
   npm install  
   npm run dev

---

## 📚 Learn More

- Expo Documentation: https://docs.expo.dev/
- Expo Router Guide: https://docs.expo.dev/router/introduction/
- MongoDB Docs: https://www.mongodb.com/docs/manual/

---

## 🧑‍🤝‍🧑 Join the Community

- Expo GitHub: https://github.com/expo/expo  
- Expo Discord: https://chat.expo.dev
