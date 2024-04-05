import mongoose, { Schema, Document } from 'mongoose';
import { SearchResult } from './SearchEngine';

export interface IUserHistory extends Document {
    userEmail: string;
    query: string;
    timestamp: Date;
    searchResult: SearchResult[];
}

const UserHistorySchema: Schema = new Schema({
    userEmail: { type: String, required: true },
    query: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    searchResult: [{ title: String, snippet: String, link: String, description: String }]
});

const UserHistory = mongoose.model<IUserHistory>('UserHistory', UserHistorySchema);

export default UserHistory;
