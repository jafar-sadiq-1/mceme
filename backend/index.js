const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDb = require('./db.js');
const bodyParser = require('body-parser');

// Load environment variables
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB and start server
connectDb()
  .then(() => {
    // Import Routes
    const UnitsRouter = require('./routes/UnitsRoute');
    const FDRRouter = require('./routes/FDRRoute.js');
    const ReceiptsRouter = require('./routes/ReceiptsRoute.js');
    const PaymentRouter = require('./routes/PaymentRoute.js');
    const signinRoutes = require('./routes/signin');
    const userapprovalRoutes = require('./routes/user_approvals');
    const approvalRoutes = require('./routes/approvalsRoute');
    const financialYearsRoute = require("./routes/FinancialYearsRoute");
    // Removed VouchersRouter import

    // Mount routes with prefixes
    app.use('/api/units', UnitsRouter);
    app.use('/api/fdr', FDRRouter);
    app.use('/api/receipts', ReceiptsRouter);
    app.use('/api/payments', PaymentRouter);
    app.use("/api/financialYears", financialYearsRoute);
    // Removed VouchersRouter mounting
    app.use(signinRoutes);
    app.use(userapprovalRoutes);
    app.use('/api/approvalsRoute', approvalRoutes); // Updated this line to match frontend URL

    // Test Route
    app.get('/', (req, res) => res.send('Server is running ✅'));

    // Start the server
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error('❌ Error connecting to MongoDB:', err));
