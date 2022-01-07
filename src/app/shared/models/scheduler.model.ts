import { SchedulerResourceType } from '../enums';
import { UserInfoModel } from './user-info.model';

export interface Scheduler {
    organizationId: string;
    projectId: string;
    resourceId: string;
    resourceType: SchedulerResourceType
    schedulerId: string;
    name: string;
    recurringRule: string;
    emails: string[];
    active: boolean;
    createdBy?: UserInfoModel;
    createdDate?: Date;
    updatedBy?: UserInfoModel;
    updatedDate?: Date;
}