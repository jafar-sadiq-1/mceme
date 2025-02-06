const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDb = require('./db.js');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB and start server
connectDb()
  .then(() => {
    console.log('✅ MongoDB Connected');

    // Import Routes
    const UnitsRouter = require('./routes/UnitsRoute');
    const FDRRouter = require('./routes/FDRRoute.js');
    const ReceiptsRouter = require('./routes/ReceiptsRoute.js');
    const PaymentRouter = require('./routes/PaymentRoute.js');
    const signinRoutes = require('./routes/signin');
    const approvalRoutes = require('./routes/user_approvals');

    // Mount routes with prefixes
    app.use('/api/units', UnitsRouter);
    app.use('/api/fdr', FDRRouter);
    app.use('/api/receipts', ReceiptsRouter);
    app.use('/api/payments', PaymentRouter);
    app.use(signinRoutes);
    app.use(approvalRoutes);

    // Test Route
    app.get('/', (req, res) => res.send('Server is running ✅'));

    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error('❌ Error connecting to MongoDB:', err));
