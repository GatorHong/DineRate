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
DineRate/
├── client/      # React Native Expo frontend
├── server/      # Express backend with MongoDB
└── README.md
```


---

## 🏁 Project Setup Workflow

### 🛠️ First-Time Setup (Do this **once**)

Follow these steps when setting up DineRate for the very first time on your machine:

1. **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd DineRate
    ```

2. **Install all dependencies for both frontend and backend:**

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
    MONGO_URI=mongodb://127.0.0.1:27017/dinerate
    PORT=5000
    ```

---



## 🛠️ Frontend Setup (React Native with Expo)

1. Open a terminal and navigate to the `client` folder:
    ```bash
    cd client
    ```

2. Install dependencies:
    ```bash
    npm install
    npx expo install expo-location
    ```

3. Start the Expo development server:
    ```bash
    npx expo start
    ```

4. You can now preview the app using:
    - **Expo Go app** on your physical device (scan the QR code)
    - **Android Emulator**: [Expo Android Setup](https://docs.expo.dev/workflow/android-studio-emulator/)
    - **iOS Simulator**: [Expo iOS Setup](https://docs.expo.dev/workflow/ios-simulator/)
    - **Development builds**: [Expo Dev Builds](https://docs.expo.dev/develop/development-builds/introduction/)

---

## 🛠️ Backend Setup (Node.js + Express + MongoDB)

1. Open a **second terminal** and navigate to the `server` folder:
    ```bash
    cd server
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:  
    Create a `.env` file inside the `server/` folder and add:
    ```env
    MONGO_URI=mongodb://127.0.0.1:27017/dinerate
    PORT=5000
    ```

4. Start the backend server:
    ```bash
    npm run dev
    ```

5. Your backend will run at:  
    `http://localhost:5000`

---

### 🛠️ MongoDB Local Installation (Windows)

1. Download the installer:  
    [MongoDB Community Edition](https://www.mongodb.com/try/download/community)

2. During installation:
    - ✅ Check "Install MongoDB as a Service"
    - ✅ Include MongoDB Compass (optional)

3. Add MongoDB to your system PATH:
    - Navigate to:  
        `C:\Program Files\MongoDB\Server\<your-version>\bin`
    - Copy the path.
    - Go to:  
        System Properties → Environment Variables → Path → New → Paste the path.

4. Start MongoDB:
    ```bash
    mongod
    ```

---

### 🔄 Daily Development Workflow (Every time you start coding)

Do these steps each time you want to work on the project:

1. **Start MongoDB** (if not running):
    ```bash
    mongod
    ```

2. **Start the backend server:**
    ```bash
    cd server
    npm run dev
    ```

3. **Start the frontend (Expo) server:**
    ```bash
    cd client
    npx expo start
    ```

4. **Use Expo Go, Android Emulator, or iOS Simulator to view the app.**

---

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [MongoDB Manual](https://www.mongodb.com/docs/manual/)
- [Express.js Guide](https://expressjs.com/en/starter/installing.html)

---

## 🤝 Join the Community

- [Expo GitHub](https://github.com/expo/expo)
- [Expo Discord](https://chat.expo.dev)
