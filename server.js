import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import serviceRouter from "./routes/serviceRoute.js";
import axios from "axios";

// App Config
//Creating enstance of the express server
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// // Swagger configuration
// const swaggerOptions = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "My API",
//       version: "1.0.0",
//       description: "API Documentation",
//     },
//     servers: [
//       {
//         url: "http://localhost:4000", // Update this after deployment
//       },
//     ],
//   },
//   apis: ["./routes/userRoute.js"], // Points to files with Swagger comments
// };

// const swaggerDocs = swaggerJsDoc(swaggerOptions);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//middlewares
//parsing all our requests using json
app.use(express.json());
app.use(cors());

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;
const ORS_API_KEY = process.env.ORS_API_KEY;

// Geocode with OpenCage
async function geocodeAddress(address) {
  const url = `https://api.opencagedata.com/geocode/v1/json`;

  const res = await axios.get(url, {
    params: {
      key: OPENCAGE_API_KEY,
      q: address,
      limit: 1,
    },
  });

  const results = res.data?.results;

  if (!Array.isArray(results) || results.length === 0) {
    console.error("Geocoding failed for:", address);
    console.error("Raw geocoding response:", res.data);
    throw new Error(`No geocoding result found for "${address}"`);
  }

  const location = results[0]?.geometry;
  if (!location) {
    throw new Error(`Invalid geometry returned for "${address}"`);
  }

  return {
    lat: location.lat,
    lng: location.lng,
  };
}

// Calculate distance & duration with OpenRouteService
async function getRouteInfo(start, end) {
  const url =
    "https://api.openrouteservice.org/v2/directions/driving-car/geojson";

  const body = {
    coordinates: [
      [start.lng, start.lat],
      [end.lng, end.lat],
    ],
  };

  try {
    console.log("📡 Sending request to OpenRouteService...");
    console.log("  ➤ Coordinates:", JSON.stringify(body.coordinates));

    const response = await axios.post(url, body, {
      headers: {
        Authorization: ORS_API_KEY,
        "Content-Type": "application/json",
      },
    });

    // 🧾 Log full response once
    //console.log("📦 ORS raw response:", JSON.stringify(response.data, null, 2));

    const features = response.data?.features;
    if (!Array.isArray(features) || features.length === 0) {
      throw new Error("Route calculation failed — no features returned");
    }

    const summary = features[0]?.properties?.summary;
    if (!summary) {
      throw new Error("Missing route summary");
    }

    return {
      distance: `${(summary.distance / 1000).toFixed(2)} km`,
      duration: `${Math.ceil(summary.duration / 60)} mins`,
    };
  } catch (error) {
    console.error("❌ ORS request failed:", error.message);
    if (error.response) {
      console.error("🔎 ORS error response:", error.response.data);
    }
    throw new Error("Failed to get route from OpenRouteService");
  }
}

// async function getRouteInfo(start, end) {
//   const url = `https://api.openrouteservice.org/v2/directions/driving-car`;

//   console.log(" Getting route from:");
//   console.log("  Origin:", start);
//   console.log("  Destination:", end);

//   const res = await axios.post(
//     url,
//     {
//       coordinates: [
//         [start.lng, start.lat],
//         [end.lng, end.lat],
//       ],
//     },
//     {
//       headers: {
//         Authorization: ORS_API_KEY,
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   const features = res.data?.features;

//   if (!Array.isArray(features) || features.length === 0) {
//     console.error("Route response invalid:", res.data);
//     throw new Error("Route calculation failed — no features returned");
//   }

//   const summary = features[0]?.properties?.summary;
//   if (!summary) {
//     throw new Error("Missing route summary data");
//   }

//   return {
//     distance: `${(summary.distance / 1000).toFixed(2)} km`,
//     duration: `${Math.ceil(summary.duration / 60)} mins`,
//   };
// }

// API Endpoint
app.post("/api/location-distance", async (req, res) => {
  try {
    const { originName, destinationName } = req.body;

    if (!originName || !destinationName) {
      return res
        .status(400)
        .json({ error: "Both origin and destination are required." });
    }

    const [origin, destination] = await Promise.all([
      geocodeAddress(originName),
      geocodeAddress(destinationName),
    ]);

    const result = await getRouteInfo(origin, destination);

    return res.json({
      origin,
      destination,
      ...result,
    });
  } catch (err) {
    console.error("Error occurred:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

//api endpoints
app.use("/api/user", userRouter);
app.use("/api/service", serviceRouter);

// when we hit this end point on our browser, it would be executed as a get request
app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(port, () => console.log("Server started on PORT : " + port));
