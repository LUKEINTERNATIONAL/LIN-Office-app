
import ApiClient from '@/service/Api';

export default class AuthService {
    constructor() {
        this.token = '';
        this.username = '';
        this.roles = [];
        this.programs = [];
        this.userID = -1;
        this.sessionDate = '';
        this.systemVersion = '';
        this.coreVersion = '';
    }

    setUsername(username) { this.username = username; }

    async loadConfig() {
        return ApiClient.getFileConfig();
    }

    async login(password,username) {
        const response = await this.requestLogin(password,username);
        if (response.message == 'success') {
            this.token = response.Token;
            this.username = response.username;
            this.startSession()
        } else {
            throw 'Unable to login';
        }
    }

    startSession() {
        sessionStorage.setItem("apiKey", 'Token '+this.token);
        sessionStorage.setItem("username", this.username);
        sessionStorage.setItem("userID", this.userID.toString());
        sessionStorage.setItem("userRoles", JSON.stringify(this.roles));
        sessionStorage.setItem("userPrograms", JSON.stringify(this.programs));
        sessionStorage.setItem("sessionDate", this.sessionDate);
        sessionStorage.setItem("APIVersion", this.systemVersion);
    }

    clearSession() {
        sessionStorage.clear();
    }

    requestLogin(password,username) {
        return this.postLogin(`users/login`, {
            username: username,
            password: password
        });
    }

 

    initDateSync(interval = 1000) {
        setInterval(async () => {
            const date = await this.getSystemDate();
            if (sessionStorage.getItem('apiDate')) {
                sessionStorage.setItem('apiDate', date);
            } else {
                sessionStorage.setItem('sessionDate', date);
            }
        }, interval);
    }


    cachingIsEnabled() {
        const val = this.getAppConf('dataCaching');
        return typeof val === 'boolean' ? val : true;
    }

    versionLockingIsEnabled() {
        const val = this.getAppConf('enableVersionLocking');
        return typeof val === 'boolean' ? val : true;
    }

    getAppConf(confKey) {
        const conf = sessionStorage.getItem('appConf');
        if (conf) {
            try {
                const confObj = JSON.parse(conf);
                return confObj[confKey];
            } catch (e) {
                console.error(e);
            }
        }
        return null;
    }

    async getApiVersion() {
        const api = await this.getJson('version');
        return api && api['System version'] ? api['System version'] : '-';
    }

    async getSystemDate() {
        const { date } = await this.getJson('current_time');
        return date;
    }

    async getJson(url) {
        const req = await ApiClient.get(url);
        if (req && req.ok)
            return req.json();
    }

    async postLogin(url, params) {
        const req = await ApiClient.post(url, params);
        if (!req)
            return;

        if (req.ok) {
            return req.json();
        }

        if (req.status === 401)
            console.log("invalid")
    }
}
