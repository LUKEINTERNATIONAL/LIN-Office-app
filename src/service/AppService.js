import { Service } from '@/service/Service';
export class AppService extends Service {
  
    static getData(url) {
       return this.getJson(url)
    }

    static groupApps(data){
        const groupedArrays = [];
        for (let i = 0; i < data.length; i += 2) {
        const pair = [data[i], data[i + 1]].filter(Boolean); 
        groupedArrays.push(pair);
        }

        return groupedArrays
    }
}

