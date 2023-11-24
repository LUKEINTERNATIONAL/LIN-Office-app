import { Service } from '@/service/Service';

export class UserService extends Service {
    static async getUsers(params = {}) {
        const data = await this.getJson('users/list',params)
        return  data.users
    }
    static createUser(data) {
        return this.postJson('users/create', data)
    }
    static updateUser(data) {
        return this.putJson('users/update', data)
    }
    static deleteUser(data) {
        return this.deleteJson('users/delete', data)
    }
 
}

