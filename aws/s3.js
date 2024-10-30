const {S3Client, GetObjectCommand, ListObjectsV2Command} = require('@aws-sdk/client-s3');
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

const s3Client = new S3Client({
    region: String(process.env.AWS_REGION),
    credentials: {
        accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
        secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
    },
});

const bucketName = 'spacedash';

/**
 * Retrieves pre-signed URLs for all character images in the S3 "characters/" folder.
 *
 * This function lists all objects in the specified "characters/" folder within the
 * S3 bucket, filters out non-image files, and generates a pre-signed URL for each
 * character image. It returns an object mapping each character color (based on filename)
 * to its pre-signed URL.
 *
 * @async
 * @function getAllCharacterURLs
 * @returns {Promise<Object>} An object containing character color keys and their respective
 *                            pre-signed URLs for accessing character images.
 */
async function getAllCharacterURLs() {
    const characterURLs = {};

    try {
        /* List all objects in the 'characters/' folder */
        const command = new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: 'characters/' // Folder prefix
        });
        const response = await s3Client.send(command);
        const {Contents} = response;

        if (Contents && Contents.length > 0) {
            /* Filter out entries that represent "folders" (keys ending with '/') */
            const validFiles = Contents.filter(({Key}) => Key && !Key.endsWith('/'));

            /* Process each valid object in the folder */
            const urlPromises = validFiles.map(async ({Key}) => {
                /* Extract the file name - e.g (green, pink, blue, etc )*/
                const colour = Key.split('/').pop().split('.').shift();
                const command = new GetObjectCommand({Bucket: bucketName, Key});
                const characterURL = await getSignedUrl(s3Client, command, {expiresIn: 3600});
                return {[colour]: characterURL};
            });

            /* Wait for all URLs to be generated and merge them into one object */
            const urlObjects = await Promise.all(urlPromises);
            Object.assign(characterURLs, ...urlObjects);
        } else {
            console.warn("No objects found in the specified folder.");
        }
    } catch (error) {
        console.error('Error listing character images:', error.message);
    }
    console.log("Generated character URLs:", characterURLs);
    return characterURLs;
}

module.exports = {getAllCharacterURLs};