import { Service } from '@/service/Service';

export class TimesheetService extends Service {
    static getProjects() {
        return this.getJson('projects/list')
    }
    static getHolidays() {
        return this.getJson('holidays/list')
    }
    static getTimesheets() {
        return this.getJson('timesheets/list')
    }
 
}

