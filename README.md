# AI Creative Studio 

AI Creative Studio is a full-stack project that enables users to generate **art, music, and poetry** using advanced AI models. It integrates a backend API (handling AI model calls) with a responsive frontend interface where users can interactively create and explore AI-powered creative content.

---

##  Live Features

 **AI Art Generation**  
Generate creative images from text prompts, transforming ideas into visual art using powerful AI models.

 **AI Music Creation**  
Compose original AI-driven music based on user inputs — moods, genres, and creative direction.

 **AI Poetry & Creative Text**  
Generate expressive poetry and creative writing with AI language models.

---

##  Repository Structure

AI-Creative-Studio/
├── backend/ # Backend server & API
│ ├── main.py # Backend entrypoint
│ ├── .env.example # Example environment variables
│ └── ... # Additional backend logic
├── frontend/ # Frontend user interface
│ └── ... # Your UI code
├── assets/ # Images, demos, screenshots
│ └── logo.png
├── .gitignore
└── README.md


---

##  Tech Stack

| Layer     | Technology             |
|----------|-----------------------|
| Frontend | React                 |
| Backend  | Python / FastAPI / Flask |
| AI Models | OpenAI / Hugging Face |
| Deployment | GitHub               |

---

##  Getting Started

###  Backend Setup

1. Go inside the backend folder:
   cd backend
2. Create a .env file from the example:
   cp .env.example .env

3. Install dependencies

4. Run the backend server:
   uvicorn app.main:app --reload

###  Frontend Setup
1. Go inside the frontend folder:
   cd frontend

2. Install dependencies:
   npm install
   
3. Start the frontend:
   npm start

###  Environment Variables
You must set up your API keys in a .env file — do NOT commit real keys to GitHub.

Example (backend/.env):

OPENAI_API_KEY=your_openai_key_here
HUGGINGFACE_TOKEN=your_huggingface_token_here
Access them in your code like:

import os
API_KEY = os.getenv("OPENAI_API_KEY")
###  Demo / Screenshots

###  How It Works (High Level)
* User enters a prompt on the frontend

* Frontend sends request to the backend

* Backend calls AI model API

* AI generates art, music, or poetry

* Response is sent back and displayed in the UI

* This workflow powers creative outcomes with simple user interaction.

###  Contributing
* Contributions are welcome! Feel free to open issues or make pull requests.

* Fork the repository

* Create a new branch

* Make your changes

* Submit a pull request

###  Contact
Created by Varshakh8 — reach out for collabs, questions, or feature ideas 😄
