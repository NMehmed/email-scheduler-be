"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cronService_1 = __importDefault(require("../../services/cronService"));
const dbService_1 = __importDefault(require("../../services/dbService"));
const sinon_1 = __importDefault(require("sinon"));
const cron_1 = __importDefault(require("cron"));
const chai_1 = require("chai");
const mongodb_1 = require("mongodb");
describe('Cron service tests', () => {
    const sandbox = sinon_1.default.createSandbox();
    const firstResponse = [
        { tickTime: '11:00', id: "5f9f1ca8808afe51846506cb", "_id": new mongodb_1.ObjectID("5f9f1ca8808afe51846506cb"), "emailTo": "dassada@abv.bg", "subject": "dsadasdasd", "message": "dsadsada", "dayOfMonth": 12, "weekdays": ["Monday", "Tuesday", "Wednesday"], "whenToStopMails": { "whenToStop": "never", "occurrancy": 1, "stopDate": "2020-11-01T20:37:39.078Z" }, "occurrancy": 0 },
        { tickTime: '11:00', id: "5f9f1cb3808afe51846506cc", "_id": new mongodb_1.ObjectID("5f9f1cb3808afe51846506cc"), "emailTo": "dassada1@abv.bg", "subject": "dsadasdasd", "message": "dsadsada", "dayOfMonth": 12, "weekdays": ["Monday", "Tuesday", "Wednesday"], "whenToStopMails": { "whenToStop": "never", "occurrancy": 1, "stopDate": "2020-11-01T20:37:39.078Z" }, "occurrancy": 0 }
    ];
    const secondResponse = [
        firstResponse[0],
        firstResponse[1],
        { tickTime: '11:00', id: "5f9f1cb3808afe51846506cd", "_id": new mongodb_1.ObjectID("5f9f1cb3808afe51846506cd"), "emailTo": "dassada1@abv.bg", "subject": "dsadasdasd", "message": "dsadsada", "dayOfMonth": 12, "weekdays": ["Monday", "Tuesday", "Wednesday"], "whenToStopMails": { "whenToStop": "never", "occurrancy": 1, "stopDate": "2020-11-01T20:37:39.078Z" }, "occurrancy": 0 }
    ];
    const firstResponseWithOneLess = [firstResponse[0]];
    let stubInstance;
    afterEach(() => {
        sandbox.restore();
    });
    describe('startMailCronJobs', () => { });
    describe('startNewMailCronJobs', () => {
        context('when there is one new cron job', () => {
            beforeEach(() => {
                sandbox.stub(dbService_1.default, 'getActiveEmailSchedules')
                    .onFirstCall().resolves(firstResponse)
                    .onSecondCall().resolves(secondResponse);
                stubInstance = sinon_1.default.createStubInstance(cron_1.default.CronJob);
                sandbox.stub(cron_1.default, 'CronJob').returns(stubInstance);
            });
            it('should start exactly 3 cron jobs', async () => {
                await cronService_1.default.startMailCronJobs();
                await cronService_1.default.startNewMailCronJobs();
                chai_1.expect(stubInstance.start.callCount).to.be.equal(3);
            });
        });
        context('when there no new job', () => {
            let stubInstance;
            beforeEach(() => {
                sandbox.stub(dbService_1.default, 'getActiveEmailSchedules')
                    .onFirstCall().resolves(firstResponse)
                    .onSecondCall().resolves(firstResponse);
                stubInstance = sinon_1.default.createStubInstance(cron_1.default.CronJob);
                sandbox.stub(cron_1.default, 'CronJob').returns(stubInstance);
            });
            it('should start exactly 2 cron jobs', async () => {
                await cronService_1.default.startMailCronJobs();
                await cronService_1.default.startNewMailCronJobs();
                chai_1.expect(stubInstance.start.callCount).to.be.equal(2);
            });
        });
    });
    describe('clearMailCronJobs', () => {
        context('when there is no cron job to stop', () => {
            beforeEach(() => {
                sandbox.stub(dbService_1.default, 'getActiveEmailSchedules')
                    .onFirstCall().resolves(firstResponse)
                    .onSecondCall().resolves(firstResponse);
                stubInstance = sinon_1.default.createStubInstance(cron_1.default.CronJob);
                sandbox.stub(cron_1.default, 'CronJob').returns(stubInstance);
            });
            it('should not call stop', async () => {
                await cronService_1.default.startMailCronJobs();
                await cronService_1.default.clearMailCronJobs();
                chai_1.expect(stubInstance.stop.callCount).to.be.equal(0);
            });
        });
        context('when there is outdated cron job', () => {
            beforeEach(() => {
                sandbox.stub(dbService_1.default, 'getActiveEmailSchedules')
                    .onFirstCall().resolves(firstResponse)
                    .onSecondCall().resolves(firstResponseWithOneLess);
                stubInstance = sinon_1.default.createStubInstance(cron_1.default.CronJob);
                sandbox.stub(cron_1.default, 'CronJob').returns(stubInstance);
            });
            it('should call stop', async () => {
                await cronService_1.default.startMailCronJobs();
                await cronService_1.default.clearMailCronJobs();
                chai_1.expect(stubInstance.stop.callCount).to.be.equal(1);
            });
        });
    });
});
