export default class AppService {
   getApps() {
        return fetch('demo/data/apps.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }
}
