import { Service } from '@/service/Service';

export class TimesheetService extends Service {
    static async getProjects() {
        return await this.getJson('projects/list')
    }
    static getHolidays() {
        return this.getJson('holidays/list')
    }
    static async getTimesheets(params = {}) {
        const data = await this.getJson('timesheets/get',params)
        return  data.timesheet
    }
    static createTimesheet(data) {
        return this.postJson('timesheets/create', data)
    }
    static updateTimesheet(data) {
        return this.putJson('timesheets/update', data)
    }
    static deleteTimesheet(data) {
        return this.deleteJson('timesheets/delete', data)
    }
 
}

