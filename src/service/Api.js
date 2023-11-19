

const ApiClient = (() => {
    async function getFileConfig() {
        const response = await fetch('/config.json');
        if (!response.ok) {
            throw 'Unable to retrieve configuration file/ Invalid config.json';
        }
        try {
            const { 
                apiURL, 
                apiPort, 
                apiProtocol, 
                appConf, 
                apps, 
                thirdpartyApps, 
                platformProfiles,
                otherApps,
            } = await response.json();
            sessionStorage.setItem("apiURL", apiURL);
            sessionStorage.setItem("apiPort", apiPort);
            sessionStorage.setItem("apiProtocol", apiProtocol);
            sessionStorage.setItem("appConf", JSON.stringify(appConf));
            sessionStorage.setItem("apps", JSON.stringify(apps));
            sessionStorage.setItem("thirdpartyApps", JSON.stringify(thirdpartyApps));
            sessionStorage.setItem("platformProfiles", JSON.stringify(platformProfiles));
            sessionStorage.setItem("otherApps", JSON.stringify(otherApps));
            return {
                host: apiURL,
                port: apiPort,
                protocol: apiProtocol,
                thirdpartyapps: thirdpartyApps,
                otherApps,
            };
        } catch (e) {
            console.error(e);
            throw 'API Configuration file "/config.json" has errors. Please check console log for more details';
        }
    }

    function getLocalConfig() {
        const host = localStorage.apiURL;
        const port = localStorage.apiPort;
        const protocol = localStorage.apiProtocol;
        const thirdpartyapps = localStorage.thirdpartyApps;
        const otherApps = localStorage.otherApps || [];

        if (host && port && protocol) {
            return { host, port, protocol, thirdpartyapps, otherApps };
        }
    }

    function getSessionConfig() {
        const host = sessionStorage.apiURL;
        const port = sessionStorage.apiPort;
        const protocol = sessionStorage.apiProtocol;
        const thirdpartyapps = sessionStorage.thirdpartyApps;
        const otherApps = sessionStorage.otherApps;

        if (host && port && protocol) {
            return { host, port, protocol, thirdpartyapps, otherApps };
        }
    }

    function getConfig() {
        const localConfig = getLocalConfig();
        const sessionConfig = getSessionConfig();

        if (localStorage.useLocalStorage && localConfig) {
            return localConfig;
        }

        if (sessionConfig) {
            return sessionConfig;
        }

        return getFileConfig();
    }

    async function expandPath(resourcePath) {
        const config = await getConfig();
        return `${config.protocol}://${config.host}:${config.port}/${resourcePath}`;
    }

    function headers() {
        return {
            'Authorization': sessionStorage.apiKey,
            'Content-Type': 'application/json',
            'Origin': window.location.origin,
        };
    }

    function setLocalStorage(protocol, ipAddress, port) {
        localStorage.setItem('useLocalStorage', 'true');
        localStorage.setItem('apiURL', ipAddress);
        localStorage.setItem('apiPort', port);
        localStorage.setItem('apiProtocol', protocol);
    }

    function removeOnly(inclusions) {
        inclusions.forEach(element => {
            inclusions.includes(element) && localStorage.removeItem(element);
        });
    }

    async function execFetch(uri, params) {        
        params = { ...params, mode: 'cors' };
        
        if (!('headers' in params)) {
            params = { ...params, headers: headers() };
        }

        const url = await expandPath(uri);

        try {
            const response = await fetch(url, params);
            return response;
        } catch (e) {
            // console.error(e);
            if (`${e}`.match(/NetworkError|Failed to fetch/i)) {
                console.log("Network error Failed to fetch")
            } else {
                console.log("Error with network")
            }
        }
    }
    
    const get = (uri) => execFetch(uri, { method: 'GET' });
    const post = (uri, data) => execFetch(uri, { method: 'POST', body: JSON.stringify(data) });
    const remove = (uri, data) => execFetch(uri, { method: 'DELETE', body: JSON.stringify(data) });
    const put = (uri, data) => execFetch(uri, { method: 'PUT', body: JSON.stringify(data) });
    const healthCheck = () => get('_health');

    return { get, post, put, remove, getConfig, setLocalStorage, removeOnly, expandPath, healthCheck, getFileConfig };
})();

export default ApiClient;
