import { Service } from '@/service/Service';

export class ProjectService extends Service {
    static async getProjects(params = {}) {
        const data = await this.getJson('projects/get',params)
        return  data.projects
    }
    static createProject(data) {
        return this.postJson('project/create', data)
    }
    static updateProject(data) {
        return this.putJson('project/update', data)
    }
    static deleteProject(data) {
        return this.deleteJson('project/delete', data)
    }
 
}

