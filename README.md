# 📧 Email Reply Generator using Spring Boot & Gemini API

An intelligent AI-powered Gmail extension built with Java and Spring Boot that auto-generates contextual replies to emails based on tone selection. Just click **AI Reply** in your Gmail compose window to instantly craft professional, casual, or friendly replies — powered by Google's Gemini API.

## 🚀 Features

- ⚙️ **Spring Boot API**: Receives email content and tone, constructs a prompt, fetches a response from Gemini API, and returns the reply.
- 🧠 **Gemini AI Integration**: Smart response generation based on context and selected tone.
- 📩 **Gmail Extension**:
  - Adds a seamless **"AI Reply"** button in Gmail's Compose and Reply boxes.
  - Automatically pastes the generated response into the text area.
  - Offers a dropdown to choose tone (defaults to **Professional**).

---

## 📂 Project Structure

```
Email_Reply_Generator/
├── email-writer/             # Spring Boot backend
│   ├── src/...
│   └── application.properties # Requires Gemini variables
└── email_writer_extension/   # Chrome extension for Gmail integration
```

---

## 🛠️ Tech Stack

- Java 21
- Spring Boot 6
- Gemini API (Google)
- Chrome Extension (Manifest v3)
- Gmail DOM Manipulation (JS)

---

## 🔧 Setup Instructions

### ✅ 1. Clone the Repository

```bash
git clone https://github.com/Lakshit78/Email_Reply_Generator.git
cd Email_Reply_Generator
```

### ⚙️ 2. Backend Setup (Spring Boot)

Navigate to the backend folder:

```bash
cd email-writer
```

#### 📌 Requirements
* Java 21
* Spring Boot 6

#### 🔐 Environment Variables
Set the following environment variables locally (used in `application.properties`):

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_URL=https://your-gemini-endpoint.com
```

#### ▶️ Run the API

```bash
./mvnw spring-boot:run
```

By default, the API runs at:

```
POST http://localhost:8080/api/email/request
```

Request body should be:

```json
{
  "email": "Original email content",
  "tone": "professional | casual | friendly | etc"
}
```

### 🌐 3. Chrome Extension Setup

Navigate to the extension folder:

```bash
cd email_writer_extension
```

#### 🧩 Load into Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer Mode** (top right)
3. Click **Load Unpacked** and select the `email_writer_extension` folder
4. Make sure the extension is enabled

The extension will now:
* Inject an **"AI Reply"** button beside Gmail's Send button
* Use the backend to generate responses and auto-paste them
* Allow tone selection via a dropdown

## 📸 Demo


## 📬 API Endpoint

* `POST /api/email/request`
  
  Request:
  ```json
  {
    "email": "Text of the email to reply to",
    "tone": "professional" // optional, default is professional
  }
  ```

  Response:
  ```json
  
     "Generated reply from Gemini"
  
  ```

## 📄 License

© 2025 Lakshit Gupta

This repository is licensed under the MIT license. See LICENSE for details.

## 🙌 Credits

Made with ❤️ by Lakshit Gupta