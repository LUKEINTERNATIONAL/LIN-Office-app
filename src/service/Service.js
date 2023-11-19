import Url from "@/utils/Url"
import ApiClient from '@/service/Api';

export class Service {
    static ajxGet(url, params = {}) {
        return ApiClient.get(`${url}?${Url.parameterizeObjToString(params)}`);
    }

    static async getText(url) {
        const req = await ApiClient.get(url);
        if (req && req.ok) return req?.text();
    }

    static getJsonSWR(url, params = {}) {
        const transformedUrl = `${url}?${Url.parameterizeObjToString(params)}`;
        return useSWRV(transformedUrl, key => this.getJson(key)).data;
    }

    static async getJson(url, params = {}) {
        const transformedUrl = `${url}?${Url.parameterizeObjToString(params)}`;
        return this.jsonResponseHandler(ApiClient.get(transformedUrl));
    }

    static async postJson(url, data) {
        return this.jsonResponseHandler(ApiClient.post(url, data));
    }

    static putJson(url, data) {
        return this.jsonResponseHandler(ApiClient.put(url, data));
    }

    static async void(url, reason) {
        return this.jsonResponseHandler(ApiClient.remove(url, reason));
    }

    static async getThirdpartyApps() {
        return JSON.parse((await ApiClient.getConfig()).thirdpartyapps);
    }

    static async jsonResponseHandler(request) {
        const response = await request;
        if (response) {
            if ([200, 201].includes(response.status)) {
                return response?.json();
            }

            if (response.status === 400) {
                const { errors } = await response?.json();
                throw new BadRequestError(response.statusText, errors);
            }

            if (response.status === 404) {
                const { errors } = await response?.json();
                throw new NotFoundError(errors);
            }

            if (response.status === 422) {
                const { errors, entity } = await response?.json();
                throw new IncompleteEntityError(errors, entity);
            }
            if (response.status === 502) {
                const { errors } = await response?.json();
                throw new ApiServiceError(errors || 'Getway Error');
            }
            if (response.status === 409) {
                const { errors } = await response?.json();
                throw new RecordConflictError(response.statusText, errors);
            }
            if (response.status === 500) {
                // throw new ApiError('An internal server errror has occured');
                console.log("eerrroo")
            }
        }
    }

    static async getApiDate() {
        const req = await this.getJson('current_time');
        if (req) {
            return req.date;
        }
    }

    static getApiVersion() {
        return sessionStorage.getItem('APIVersion') || '-';
    }

    static getActiveApp() {
        return HisApp.getActiveApp() || {};
    }

    static getUserID() {
        const userID = sessionStorage.getItem('userID');
        return userID ? parseInt(userID) : null;
    }

    static getUserLocation() {
        return sessionStorage.getItem('userLocation');
    }

    static getLocationName() {
        return sessionStorage.getItem('locationName');
    }

    static getSessionDate() {
        return sessionStorage.getItem('sessionDate') || '';
    }

    static getCachedApiDate() {
        return sessionStorage.getItem('apiDate');
    }

    static async setSessionDate(sessionDate) {
        const apiDate = await this.getApiDate();
        if (apiDate) {
            sessionStorage.setItem('apiDate', apiDate);
            sessionStorage.setItem('sessionDate', sessionDate);
            return;
        }
        throw 'Unable to set api date';
    }

    static async resetSessionDate() {
        const apiDate = await this.getApiDate();
        if (apiDate) {
            sessionStorage.removeItem('apiDate');
            sessionStorage.setItem('sessionDate', apiDate);
            return;
        }
        throw 'Unable to reset session date';
    }

    static getProgramName() {
        const app = this.getActiveApp();

        if ('applicationName' in app) return app.applicationName;

        return '';
    }

    static getSuspendedProgram() {
        return sessionStorage.getItem('suspendedApp') || '';
    }

    static getProgramID() {
        const app = this.getActiveApp();

        if ('programID' in app) return app.programID;

        return 0;
    }

    static getUserRoles() {
        const roles = sessionStorage.getItem('userRoles');

        return roles ? JSON.parse(roles) : [];
    }

    static getUserName() {
        return sessionStorage.username;
    }

    static getCoreVersion() {
        return localStorage.getItem(AuthVariable.CORE_VERSION) || '-';
    }

    static getAppVersion() {
        return localStorage.getItem(AuthVariable.CORE_VERSION) || '-';
    }

    static getFullVersion() {
        return `${this.getCoreVersion()} / ${this.getApiVersion()}`;
    }

    static delay = ms => new Promise(res => setTimeout(res, ms));

}
