export interface Log {
    testStepId: string;
    statusId: string;
    returnValue: string;
    screenshotLink: string;
    message: string;
    status: boolean;
    streamed: boolean;
    startTimeStamp: Date;
    endTimeStamp: Date;
}

//endTimeStamp: "2020-04-25T12:48:37.141+0000"
//message: "http://www.staging1.automationhq.ai/ is opened"
//returnValue: null
//screenshotLink: null
//startTimeStamp: "2020-04-25T12:48:23.330+0000"
//status: true
//statusId: "5ea431a581a513399ce88482"
//streamed: false
//testStepId: "20fed745-d1b3-47a3-bcba-1013ab0c56fa"