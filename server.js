require("dotenv").config({ path: "./config.env" });
const PORT = process.env.PORT || 8000;
const express = require('express');
const cors = require('cors');
const app = express();


//INIT MIDDLEWARE
app.use(express.json({ extended: false }))
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT"],
    credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => res.send('Server Running..........'))

//DEFINE ROUTES
app.use('/api/user/', require('./routes/api/user/User'));

app.use('/api/user-profile', require('./routes/api/registrar/UserProfile'));
app.use('/api/colleges', require('./routes/api/registrar/College'));
app.use('/api/department', require('./routes/api/registrar/Department'));
app.use('/api/courses', require('./routes/api/registrar/Course'));
app.use('/api/subjects', require('./routes/api/registrar/Subject'));
app.use('/api/curriculum', require('./routes/api/registrar/Curriculum'));
app.use('/api/faculty-management', require('./routes/api/registrar/FacultyManagement'));

app.use('/api/generate-subject', require('./routes/api/dean/GenerateSubject'));



app.listen(PORT, () => console.log(`Server started on port ${PORT}`));