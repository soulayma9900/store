import { Document } from 'mongoose';
import { RequestStatus } from '../requests/enums/request-status.enum';
import { RequestType } from '../requests/enums/request-type.enum';
export declare class ActionRequest extends Document {
    type: RequestType;
    status: RequestStatus;
    productId?: string | null;
    payload?: Record<string, unknown> | null;
    createdBy: string;
    createdAt: Date;
    reviewedBy?: string | null;
    reviewedAt?: Date | null;
    reviewNote?: string | null;
}
export declare const ActionRequestSchema: import("mongoose").Schema<ActionRequest, import("mongoose").Model<ActionRequest, any, any, any, Document<unknown, any, ActionRequest, any, {}> & ActionRequest & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ActionRequest, Document<unknown, {}, import("mongoose").FlatRecord<ActionRequest>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<ActionRequest> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
