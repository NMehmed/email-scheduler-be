import cronService from '../../services/cronService'
import dbService from '../../services/dbService'
import sinon, { SinonStubbedInstance } from 'sinon'
import { IMailSchedule } from '../../types/IMailSchedule'
import cron, { CronJob } from 'cron'
import { expect } from 'chai'
import { ObjectID } from 'mongodb'

describe('Cron service tests', () => {
  const sandbox = sinon.createSandbox()
  const firstResponse = [
    { tickTime: '11:00', id: "5f9f1ca8808afe51846506cb", "_id": new ObjectID("5f9f1ca8808afe51846506cb"), "emailTo": "dassada@abv.bg", "subject": "dsadasdasd", "message": "dsadsada", "dayOfMonth": 12, "weekdays": ["Monday", "Tuesday", "Wednesday"], "whenToStopMails": { "whenToStop": "never", "occurrancy": 1, "stopDate": "2020-11-01T20:37:39.078Z" }, "occurrancy": 0 },
    { tickTime: '11:00', id: "5f9f1cb3808afe51846506cc", "_id": new ObjectID("5f9f1cb3808afe51846506cc"), "emailTo": "dassada1@abv.bg", "subject": "dsadasdasd", "message": "dsadsada", "dayOfMonth": 12, "weekdays": ["Monday", "Tuesday", "Wednesday"], "whenToStopMails": { "whenToStop": "never", "occurrancy": 1, "stopDate": "2020-11-01T20:37:39.078Z" }, "occurrancy": 0 }
  ] as Array<IMailSchedule>
  const secondResponse = [
    firstResponse[0],
    firstResponse[1],
    { tickTime: '11:00', id: "5f9f1cb3808afe51846506cd", "_id": new ObjectID("5f9f1cb3808afe51846506cd"), "emailTo": "dassada1@abv.bg", "subject": "dsadasdasd", "message": "dsadsada", "dayOfMonth": 12, "weekdays": ["Monday", "Tuesday", "Wednesday"], "whenToStopMails": { "whenToStop": "never", "occurrancy": 1, "stopDate": "2020-11-01T20:37:39.078Z" }, "occurrancy": 0 }
  ] as Array<IMailSchedule>
  const firstResponseWithOneLess = [firstResponse[0]]

  let stubInstance: SinonStubbedInstance<CronJob>

  afterEach(() => {
    sandbox.restore()
  })

  describe('startMailCronJobs', () => { })

  describe('startNewMailCronJobs', () => {
    context('when there is one new cron job', () => {
      beforeEach(() => {
        sandbox.stub(dbService, 'getActiveEmailSchedules')
          .onFirstCall().resolves(firstResponse)
          .onSecondCall().resolves(secondResponse)

        stubInstance = sinon.createStubInstance(cron.CronJob)
        sandbox.stub(cron, 'CronJob').returns(stubInstance)
      })

      it('should start exactly 3 cron jobs', async () => {
        await cronService.startMailCronJobs()
        await cronService.startNewMailCronJobs()

        expect(stubInstance.start.callCount).to.be.equal(3)
      })
    })

    context('when there no new job', () => {
      let stubInstance: SinonStubbedInstance<CronJob>

      beforeEach(() => {
        sandbox.stub(dbService, 'getActiveEmailSchedules')
          .onFirstCall().resolves(firstResponse)
          .onSecondCall().resolves(firstResponse)

        stubInstance = sinon.createStubInstance(cron.CronJob)
        sandbox.stub(cron, 'CronJob').returns(stubInstance)
      })

      it('should start exactly 2 cron jobs', async () => {
        await cronService.startMailCronJobs()
        await cronService.startNewMailCronJobs()

        expect(stubInstance.start.callCount).to.be.equal(2)
      })
    })
  })

  describe('clearMailCronJobs', () => {
    context('when there is no cron job to stop', () => {
      beforeEach(() => {
        sandbox.stub(dbService, 'getActiveEmailSchedules')
          .onFirstCall().resolves(firstResponse)
          .onSecondCall().resolves(firstResponse)

        stubInstance = sinon.createStubInstance(cron.CronJob)
        sandbox.stub(cron, 'CronJob').returns(stubInstance)
      })

      it('should not call stop', async () => {
        await cronService.startMailCronJobs()
        await cronService.clearMailCronJobs()

        expect(stubInstance.stop.callCount).to.be.equal(0)
      })
    })

    context('when there is outdated cron job', () => {
      beforeEach(() => {
        sandbox.stub(dbService, 'getActiveEmailSchedules')
          .onFirstCall().resolves(firstResponse)
          .onSecondCall().resolves(firstResponseWithOneLess)

        stubInstance = sinon.createStubInstance(cron.CronJob)
        sandbox.stub(cron, 'CronJob').returns(stubInstance)
      })

      it('should call stop', async () => {
        await cronService.startMailCronJobs()
        await cronService.clearMailCronJobs()

        expect(stubInstance.stop.callCount).to.be.equal(1)
      })
    })
  })
})