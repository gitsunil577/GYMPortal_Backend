const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: 'http://localhost:5173' || 'https://gymportal-backend-96dt.onrender.com/', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve built React frontend in production
const frontendDist = path.join(__dirname, '../../my-react-app/dist');
app.use(express.static(frontendDist));

// Routes
app.use('/api/auth',      require('./routes/auth.routes'));
app.use('/api/plans',     require('./routes/plans.routes'));
app.use('/api/members',   require('./routes/members.routes'));
app.use('/api/trainers',  require('./routes/trainers.routes'));
app.use('/api/schedules', require('./routes/schedules.routes'));
app.use('/api/user',      require('./routes/user.routes'));
app.use('/api/admin',     require('./routes/admin.routes'));

// Fallback: send index.html for any non-API route (fixes SPA 404 on refresh)
app.get('*', (req, res) => {
  const indexPath = path.join(frontendDist, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) res.status(200).json({ message: 'Gym Management API running' });
  });
});


// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
