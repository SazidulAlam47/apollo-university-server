/* eslint-disable no-console */
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const sendImageToCloudinary = async (imgName: string, path: string) => {
    const uploadResult: UploadApiResponse | void = await cloudinary.uploader
        .upload(path, {
            public_id: imgName,
        })
        .catch((error) => {
            console.log(error);
        });

    fs.unlink(path, (err) => {
        if (err) {
            console.error(`Error deleting file: ${err.message}`);
        } else {
            console.log(`File '${path}' deleted successfully.`);
        }
    });

    if (uploadResult) {
        return uploadResult.secure_url;
    }
    return '';
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    },
});

export const upload = multer({ storage: storage });
