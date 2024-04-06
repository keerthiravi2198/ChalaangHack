import mongoose, { Schema, Document } from 'mongoose';


export enum EnumUserFeedback {
    UPVOTE = 'upvote',
    DOWNVOTE = 'downvote',
    NEUTRAL = 'neutral',
}


export interface IUserHistory extends Document {
    userEmail: string;
    query: string;
    timestamp: Date;
    searchResult: string;
    feedback: EnumUserFeedback;
}

const UserHistorySchema: Schema = new Schema({
    userEmail: { type: String, required: false },
    query: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    searchResult: {type: String},
    feedback: { type: String, require: false }
    }, 
    {
    timestamps: true
  });

const UserHistory = mongoose.model<IUserHistory>('UserHistory', UserHistorySchema);

export default UserHistory;
