const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS|| "http://localhost:3000",
  credentials: true,
};
pp.use(cors({origin: function(origin, callback) 
  {        
    if (!origin) return callback(null, true);                
    if (allowedOrigins.indexOf(origin) === -1) 
      {            
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';            
        return callback(new Error(msg), false);        
      }        
      return callback(null, true);    
    },    
    credentials: true}));
    app.use((req, res, next) => {    
      res.header("Access-Control-Allow-Credentials", "true");    
      next();
    });
   
// Middleware
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());


const userRouter = require("./routes/user.routes");
const adminRouter = require("./routes/admin.routes");
const promoterRouter = require("./routes/promoter.routes");
const misRouter = require("./routes/mis.routes");
const managerRouter = require("./routes/manager.routes");

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/promoter", promoterRouter);
app.use("/api/v1/mis", misRouter);
app.use("/api/v1/manager", managerRouter);



module.exports = app;