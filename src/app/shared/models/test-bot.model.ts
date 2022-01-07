import { TestSuiteView } from './test-suite-view.model';
import { UserInfoModel } from './user-info.model';
import { GlobalParameters } from './global-parameters.model';

export interface TestBot {
    organizationId: string;
    projectId: string;
    testBotId: string;
    name: string;
    description?: string;
    testSuites?: TestSuiteView[];
    configuration?: GlobalParameters;
    createdBy?: UserInfoModel;
    createdDate?: Date;
    updatedBy?: UserInfoModel;
    updatedDate?: Date;
}
