import { S3, PutObjectAclCommand } from "@aws-sdk/client-s3"
import fs from "fs"

const s3 = new S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
    region: process.env.AWS_REGION as string,
});

export const uploadFile = async (file: any) => {
    try {
        const fileStream = fs.createReadStream(file.path)

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME as string,
            Key: file.filename,
            Body: fileStream,
        }
    
        const command = new PutObjectAclCommand(params);
        const res = await s3.send(command);
    
        console.log(res)
    
        return res;
    } catch(err) {
        console.log(err)
    } finally {
        fs.unlinkSync(file.path)
    }
   
}