import mongoose, { Schema, Document } from 'mongoose';
import { SearchResult } from './SearchEngine';
import { ParsedSearchResult } from "./SeachController";
export interface IUserHistory extends Document {
    userEmail: string;
    query: string;
    timestamp: Date;
    searchResult: SearchResult[];
    feedback: boolean;
}

const UserHistorySchema: Schema = new Schema({
    userEmail: { type: String, required: false },
    query: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    searchResult: {type: String},
    feedback: { type: Boolean, require: false }
    }, 
    {
    timestamps: true
  });

const UserHistory = mongoose.model<IUserHistory>('UserHistory', UserHistorySchema);

export default UserHistory;
