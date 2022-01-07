import { CustomProperty } from './custom-property.model';

export interface Configuration {
    organizationId: string;
    projectId: string;
    configurationId: string;
    baseUrl: string;
    browser: string;
    gridUrl: string;
    type: string;
    screenshotAfterEachStep: boolean;
    screenshotOnError: boolean;
    screenshotOnFinish: boolean;
    closeBrowserAfterEachExecution: boolean;
    timeout: number;
    waitForElementTimeout: number;
    customProperties: CustomProperty[];
}

