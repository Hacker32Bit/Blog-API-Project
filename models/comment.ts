import mongoose, { Document, Schema } from "mongoose";

interface IComment extends Document {
  content: string;
  author: Schema.Types.ObjectId;
  article: Schema.Types.ObjectId;
  parentComment: Schema.Types.ObjectId;
  replies: IComment[];
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
      min: 10,
      max: 50,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    article: {
      type: Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const Comment = mongoose.model<IComment>("Comment", commentSchema);
export default Comment;