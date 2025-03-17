import { InferSchemaType, model, Schema } from "mongoose";

const userInformationSchema = new Schema(
  {
    firstName: {
      type: String,
      required: false,
    },
    middleName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    imageUrl: {
      type: String, // Store URL of the image
      required: false,
    },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userInformation: {
      type: userInformationSchema,
      required: false, // Makes it optional
      default: null,
    },
  },
  { timestamps: true }
);

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
