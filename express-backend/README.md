# Express Backend

This folder contains the Express + Mongoose backend for CodeGenius.

Required environment variables (create a `.env` file in this folder or set these in your environment):

- MONGO_URI - MongoDB connection string (e.g. `mongodb://localhost:27017/` for local dev)
- PORT - port the server listens on (default `8080`)

Quick start (PowerShell):

```powershell
cd 'C:\Users\Asus\Downloads\CodeGenius-main\express-backend'
# create .env with the required vars (if not created already)
notepad .env
# make sure MongoDB is running locally (mongod)
node index.js
```

Or set environment variables for the session and run:

```powershell
$env:MONGO_URI = 'mongodb://localhost:27017/'
$env:PORT = '8080'
node index.js
```

Notes
- Do NOT commit your `.env` into source control. Add it to `.gitignore` if needed.
- If the app logs an error about missing or invalid MongoDB URI, verify `MONGO_URI` is set and the MongoDB server is reachable.
