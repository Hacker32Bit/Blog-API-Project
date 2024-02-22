import mongoose, { Document, Schema } from "mongoose";

interface IArticle extends Document {
  title: string;
  image: string;
  content: string;
  comments: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId;
  categories: Schema.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const articleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: true,
      min: 5,
      max: 50,
    },
    image: {
      type: String,
      default: "default.png",
    },
    content: {
      type: String,
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    }
  },
);

const Article = mongoose.model<IArticle>("Article", articleSchema);
export default Article;
