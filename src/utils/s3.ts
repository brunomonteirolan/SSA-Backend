import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as fs from "fs";
import { Readable } from "stream";

import { aws } from "../constants/configConstants";
import { SupportedApps } from "./supportedApps";

const { bucketName, region, accessKeyId, secretAccessKey } = aws.s3;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

type UploadFile = (
  file: Express.Multer.File,
  app: SupportedApps,
  options?: { key?: string }
) => Promise<{ Key: string }>;

export const uploadFile: UploadFile = async (file, app, { key } = {}) => {
  const fileStream = fs.createReadStream(file.path);
  const objectKey = key ?? `${app}/${file.filename}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Body: fileStream,
    Key: objectKey,
    ContentType: file.mimetype,
  });

  await s3Client.send(command);
  return { Key: objectKey };
};

export const getFileStream = (fileKey: string): Readable => {
  const command = new GetObjectCommand({ Bucket: bucketName, Key: fileKey });

  // Return a pass-through stream and pipe async
  const { PassThrough } = require("stream");
  const passThrough = new PassThrough();

  s3Client.send(command).then(({ Body }) => {
    if (Body instanceof Readable) {
      Body.pipe(passThrough);
    } else {
      passThrough.destroy(new Error("S3 response body is not a readable stream"));
    }
  }).catch((err: Error) => passThrough.destroy(err));

  return passThrough;
};

export const getFilePromise = async (fileKey: string): Promise<{ Body?: Readable }> => {
  const command = new GetObjectCommand({ Bucket: bucketName, Key: fileKey });
  const response = await s3Client.send(command);
  return { Body: response.Body as Readable };
};

export const getFileUrl = async (fileKey: string, expiresTime = 60): Promise<string> => {
  const command = new GetObjectCommand({ Bucket: bucketName, Key: fileKey });
  return getSignedUrl(s3Client, command, { expiresIn: expiresTime });
};

export const deleteFile = async (fileKey: string): Promise<void> => {
  const command = new DeleteObjectCommand({ Bucket: bucketName, Key: fileKey });
  await s3Client.send(command);
};
