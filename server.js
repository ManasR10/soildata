const express = require('express');
const AWS = require('aws-sdk');
const app = express();
require('dotenv').config();
const cors = require('cors');
app.use(cors());  // Enable CORS for all origins

// Configure AWS SDK
AWS.config.update({
    region: 'ap-southeast-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

// Function to fetch all files from the S3 bucket and sort them by LastModified
const getAllFilesFromS3 = async (bucketName) => {
    try {
        const params = {
            Bucket: bucketName,
            MaxKeys: 1000 // Adjust based on expected number of files
        };
        const data = await s3.listObjectsV2(params).promise();

        if (!data.Contents || data.Contents.length === 0) {
            console.log('No files found in the bucket');
            return [];
        }

        // Log the returned file list for debugging
        console.log('Fetched Files:', data.Contents.map(file => ({
            Key: file.Key,
            LastModified: file.LastModified,
        })));

        // Sort files by LastModified date in descending order (latest first)
        const sortedFiles = data.Contents.sort((a, b) => {
            return new Date(b.LastModified) - new Date(a.LastModified);
        });

        // Log sorted files for debugging
        console.log('Sorted Files:', sortedFiles.map(file => ({
            Key: file.Key,
            LastModified: file.LastModified,
        })));

        return sortedFiles;  // Return all sorted files
    } catch (error) {
        console.error('Error listing files in S3:', error);
        throw error;
    }
};

// Function to fetch the content of a specific file from S3
const fetchFileDataFromS3 = async (bucketName, key) => {
    const params = { Bucket: bucketName, Key: key };

    try {
        const data = await s3.getObject(params).promise();
        const fileContent = data.Body.toString('utf-8');  // Convert buffer to string

        // Attempt to parse the content as JSON
        try {
            return JSON.parse(fileContent);  // Parse string as JSON
        } catch (error) {
            console.error('Error parsing file data from S3:', error);
            throw new Error('Invalid JSON format in the file');
        }
    } catch (error) {
        console.error('Error fetching data from S3:', error);
        throw error;
    }
};

// API endpoint to get both the latest and historical sensor data from the S3 bucket
app.get('/api/s3-data', async (req, res) => {
    const bucketName = 'soil-bucket-aws-iot';  // Your S3 bucket name

    try {
        // Fetch all files in the bucket
        const allFiles = await getAllFilesFromS3(bucketName);

        if (allFiles.length === 0) {
            return res.status(404).json({ message: 'No files found in the bucket' });
        }

        // Get the latest file (first in the sorted array)
        const latestFile = allFiles[0];

        // Fetch the data from the latest file
        const latestReading = await fetchFileDataFromS3(bucketName, latestFile.Key);

        // Fetch all file data (optional, only if needed for historical data)
        const allReadings = await Promise.all(
            allFiles.map(async (file) => {
                const fileData = await fetchFileDataFromS3(bucketName, file.Key);
                return {
                    ...fileData,
                    timestamp: file.LastModified,  // Include the LastModified timestamp for each reading
                };
            })
        );

        // Return both the latest reading and all historical readings
        res.json({
            latestReading: {
                ...latestReading,
                timestamp: latestFile.LastModified,  // Add timestamp to the latest reading
            },
            allReadings,  // All historical readings
        });
    } catch (error) {
        console.error('Failed to fetch data from S3:', error);
        res.status(500).json({ message: 'Failed to fetch data from S3' });
    }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
