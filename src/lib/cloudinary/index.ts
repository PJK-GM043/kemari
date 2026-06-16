import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dadkzifol",
  api_key: process.env.CLOUDINARY_API_KEY || "863496563866516",
  api_secret: process.env.CLOUDINARY_API_SECRET || "RIEcGMf-ZhmFeV1w_LECwRX2VGs",
});

export const uploadToCloudinary = cloudinary.v2.uploader;
