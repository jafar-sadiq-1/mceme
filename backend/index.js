const express = require('express');
const connectDb = require('./db.js');
const bodyParser = require('body-parser');
const cors  = require('cors');
const UnitsRouter = require('./routes/UnitsRoute');
const FDRRouter = require('./routes/FDRRoute.js');
const ReceiptsRouter = require('./routes/ReceiptsRoute.js');
const PaymentRouter = require('./routes/PaymentRoute.js');

const app = express();

const PORT = process.env.PORT||5000;

connectDb();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/units',UnitsRouter);
app.use('/api/fdr',FDRRouter);
app.use('/api/receipts', ReceiptsRouter);
app.use('/api/payments', PaymentRouter);

app.listen(PORT,()=>{
  console.log(`Server is running on port:${PORT}`);
})

