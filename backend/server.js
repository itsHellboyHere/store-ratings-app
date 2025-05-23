const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 5000;

// cors
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5000']

}));
// middleware to parse to JSON
app.use(express.json());

// Routes

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api', require('./routes/authRoutes'));
app.use('/api/users', require("./routes/userRoutes"))
app.use('/api/admin/', require("./routes/adminDashboardRoutes"))
app.use('/api/stores', require("./routes/storeRoutes"))
// start the server

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})