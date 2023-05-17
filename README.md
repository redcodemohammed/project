# College Project

This is a web application built with Node.js, AdonisJS, and Postgres on the backend and Nuxt.js on the frontend. The backend and frontend live in two separate directories called `API` and `UI`, respectively.

## Requirements

- Node.js
- Postgres
- Git

## Installation

1. Clone the repository: `git clone https://github.com/redcodemohammed/project.git`
2. Navigate to the `API` directory: `cd API`
3. Install dependencies: `npm install`
4. Set up the database:
   - Create a new Postgres database
   - Copy the `.env.example` file to `.env` and update the database connection settings
   - Run the migrations: `node ace migration:run`
5. Start the API server: `npm start`

   - The API server will listen on port `3333`

6. Open a new terminal window/tab and navigate to the `UI` directory: `cd ../UI`
7. Install dependencies: `npm install`
8. Start the Nuxt.js server: `npm run dev`
   - The frontend will listen on port `3000`

## Usage

Once the API and frontend servers are running, you can visit `http://localhost:3000` in your browser to use the application.
