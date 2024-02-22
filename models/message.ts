import mongoose, { Document, Schema } from "mongoose";

interface IMessage extends Document {
  content: string;
  sender: string;
  receiver: string;
}

const messageSchema = new Schema<IMessage>(
  {
    content: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model<IMessage>("Message", messageSchema);
export default Message;
