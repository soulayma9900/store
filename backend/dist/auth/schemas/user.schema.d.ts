import { Document } from 'mongoose';
import { Role } from '../roles.enum';
export declare class AppUser extends Document {
    username: string;
    passwordHash: string;
    roles: Role[];
}
export declare const AppUserSchema: import("mongoose").Schema<AppUser, import("mongoose").Model<AppUser, any, any, any, Document<unknown, any, AppUser, any, {}> & AppUser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AppUser, Document<unknown, {}, import("mongoose").FlatRecord<AppUser>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<AppUser> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
