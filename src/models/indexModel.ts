import mongoose, { Schema, Document } from 'mongoose';

export interface Example extends Document {
  name: string;
}

const ExampleSchema: Schema = new Schema({
  name: { type: String, required: true },
});

export default mongoose.model<Example>('Example', ExampleSchema);