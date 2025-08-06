# 🍽️ DineRate

DineRate is a restaurant rating and review application built with **React Native (Expo)** on the frontend and **Node.js + MongoDB** on the backend.

---

## 📄 Project Documents

- [Project Documentation](https://docs.google.com/document/d/1W4X9eVA9Q5IpPLjczei6R3KohnyaEdRY0KPBzs-iq6g/edit?usp=sharing)
- [User Story](https://docs.google.com/document/d/1xSLjSf7dwzB2mLF7UVhnWSOh7-C3nv561PlomYQYsFQ/edit?usp=sharing)
- [Product Backlog](https://docs.google.com/document/d/1GmRpzB3C9ZOoC-8YAY87VbYj4dz0q1FcRgDMcnN24dI/edit?usp=sharing)
- [Software Architecture Models](https://docs.google.com/document/d/1h8wXCg4vSrbHAELRN5YaBw80SWi1nlluY5IqDACGV0g/edit?usp=sharing)
- [Sprint Retrospective (Module 6)](https://docs.google.com/document/d/1MbQkiB0ykF_aHopwrtce8XnawwX37eI-hUad5uLwl7k/edit?usp=sharing)
- [Presentation Slide](https://docs.google.com/presentation/d/1EEQ10oYte1v-55WKfstGGSpGmSx8MYTLaVl-BUDt-bc/edit?usp=sharing)
- [Sprint 1 Presentation](https://docs.google.com/presentation/d/18bzejdqN24Z-qWg7hXyeOIU-y7PUi2-JohPmL0mvQd4/edit?usp=sharing)
- [Documentation Report](https://docs.google.com/document/d/1jOUgxgivcps8LqwIHUEZrWq-3Z5TEBrNvIB4DMdmTkM/edit?usp=sharing)
- [Final Presentation](https://docs.google.com/presentation/d/1ea-zvXJDvOFaTVhsQOSY6LjtgCy5kOG3eIAWlKarGEU/edit?usp=sharing)
---

## 📁 Repository Structure

```

gatorhong-dinerate/
├── client/ # React Native (Expo) frontend
│ ├── app/ # App screens & routing (Expo Router)
│ ├── assets/ # Fonts and images
│ ├── components/# Reusable UI components
│ ├── constants/ # Style and config constants
│ ├── context/ # Global context (auth)
│ └── services/ # API interaction logic
├── server/ # Express backend with MongoDB Atlas
│ ├── config/ # DB configuration
│ ├── controllers/ # Route logic
│ ├── middlewares/# Middleware (auth)
│ ├── models/ # Mongoose schemas
│ └── routes/ # API route definitions
└── README.md # Project documentation
```


---

## 🏁 Project Setup Workflow

### 🛠️ First-Time Setup (Do this **once**)

Follow these steps to set up DineRate for the first time on your machine:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/GatorHong/DineRate.git
    cd DineRate
    ```

2. **Install dependencies for both frontend and backend:**

    - Frontend:
        ```bash
        cd client
        npm install
        ```

    - Backend:
        ```bash
        cd ../server
        npm install
        ```

3. **Install Expo CLI globally (if not already installed):**
    ```bash
    npm install -g expo-cli
    ```

4. **Create a `.env` file inside the `server/` folder:**
    ```env
    MONGO_URI=<your-mongodb-atlas-connection-string>
    PORT=5000
    ```

---

### 🧪 Running the App

#### 1. Start the backend server:

Open a terminal and run:
```bash
cd server
npm run dev
```

The backend will run at: `http://localhost:5000`

#### 2. Start the frontend (Expo app):

Open another terminal and run:
```bash
cd client
npx expo install expo-location   # Run once if not installed
npx expo start
```

You can preview the app using:
- **Expo Go app** on your physical device (scan the QR code)
- **Android Emulator** or **iOS Simulator**
- **Development builds**: [Expo Dev Builds](https://docs.expo.dev/develop/development-builds/introduction/)

---

### 🔁 Daily Development Workflow

Every time you start working on the project:

1. Start the backend:
    ```bash
    cd server
    npm run dev
    ```

2. Start the frontend:
    ```bash
    cd client
    npx expo start
    ```



---

## Resources

### Mobile & Frontend

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [React Navigation](https://reactnavigation.org/)
- [Async Storage](https://react-native-async-storage.github.io/async-storage/)
- [Axios](https://axios-http.com/)

### Backend & API

- [Express.js](https://expressjs.com/)
- [JWT Auth](https://jwt.io/)
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service)

### Database

- [MongoDB Docs](https://docs.mongodb.com/)
- [MongoDB Manual](https://www.mongodb.com/docs/manual/)

### Project Management

- [Jira](https://www.atlassian.com/software/jira)


---

## 🤝 Join the Community

- [Expo GitHub](https://github.com/expo/expo)
- [Expo Discord](https://chat.expo.dev)
