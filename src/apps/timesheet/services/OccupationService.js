import { Service } from '@/service/Service';

export class OccupationService extends Service {
    static async getOccupations(params = {}) {
        const data = await this.getJson('occupations/get',params)
        return  data.occupations
    }
    static createOccupation(data) {
        return this.postJson('occupations/create', data)
    }
    static updateOccupation(data) {
        return this.putJson('occupations/update', data)
    }
    static deleteOccupation(data) {
        return this.deleteJson('occupations/delete', data)
    }
 
}

