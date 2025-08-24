import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer"; // Import multer
import chat from "./chat.js";

dotenv.config(); //write .env file to process(for server, like windows in browser),as global settings

const app = express(); //nodejs framework, like SpringBoot at back-end
app.use(cors()); //walk around cross origin resource sharing

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); //more flexible destination
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const PORT = 5001;

let filePath;

app.post("/upload", upload.single("file"), async (req, res) => {
  // Use multer to handle file upload
  filePath = req.file.path; // The path where the file is temporarily saved on server
  //But normally, we'll use cache like Reddis to store, improve fault tolerance
  res.send(filePath + " upload successfully.");
});

app.get("/chat", async (req, res) => {
  const resp = await chat(filePath, req.query.question); // Pass the file path to your main function
  res.send(resp.text);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
