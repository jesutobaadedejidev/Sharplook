import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// App Config
//Creating enstance of the express server
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API Documentation",
    },
    servers: [
      {
        url: "http://localhost:3000", // Update this after deployment
      },
    ],
  },
  apis: ["./routes/*.js"], // Points to files with Swagger comments
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//middlewares
//parsing all our requests using json
app.use(express.json());
app.use(cors());

//api endpoints
app.use("/api/user", userRouter);

// when we hit this end point on our browser, it would be executed as a get request
app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(port, () => console.log("Server started on PORT : " + port));
