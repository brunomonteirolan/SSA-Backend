import dotenv from "dotenv";

export const dev = process.env.NODE_ENV === "development";
dotenv.config({ path: dev ? ".env.dev" : ".env" });

export const appUrl = process.env.BACKEND_APP_URL;
export const port = process.env.PORT || 35000;

export const web = { url: process.env.WEB_APP_URL || "" };

// Mongo
export const mongo = { url: process.env.MONGO_URL || "" };

export const aws = {
  s3: {
    bucketName: process.env.AWS_BUCKET_NAME || "",
    region: process.env.AWS_BUCKET_REGION || "",
    accessKeyId: process.env.AWS_ACCESS_KEY || "",
    secretAccessKey: process.env.AWS_SECRET_KEY || "",
  },
};
