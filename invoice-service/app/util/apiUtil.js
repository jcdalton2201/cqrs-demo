import config from '../config/environment/index.js';
export default class ApiUtil {
    constructor() {
        this.myHeader = new Headers();
        this.myHeader.append('Content-Type', 'application/json');
        this.myHeader.append('Access-Control-Allow-Origin', '*');
        this.baseDomain = config.api_base_uris.api_gw;
    }
    __handleErrors() {}
    // deleteCall(url, userEid) {
    //     this.myHeader.set('usereid', userEid);
    //     let options = {
    //         headers: this.myHeader,
    //         method: 'DELETE',
    //     };
    //     return fetch(url, options)
    //         .then((res) => {
    //             if (!res.ok) {
    //                 throw new Error(res.statusText);
    //             }
    //             return res.json();
    //         })
    //         .then((data) => {
    //             return data;
    //         })
    //         .catch((error) => {
    //             throw error;
    //         });
    // }
    async postCall(url, data) {
        let options = {
            headers: this.myHeader,
            method: 'POST',
            body: JSON.stringify(data),
        };
        const resonse = await fetch(this.baseDomain + url, options);
        const json = await resonse.json();
        return json;
    }
    async putCall(url, data) {
        let options = {
            headers: this.myHeader,
            method: 'PUT',
            body: JSON.stringify(data),
        };
        console.log(this.baseDomain + url);
        const resonse = await fetch(this.baseDomain + url, options);
        const json = await resonse.json();
        return json;
    }
    // patchCall(url, data, userEid) {
    //     this.myHeader.set('usereid', userEid);
    //     let options = {
    //         headers: this.myHeader,
    //         method: 'PATCH',
    //         body: JSON.stringify(data),
    //     };
    //     return fetch(url, options)
    //         .then((res) => {
    //             if (!res.ok) {
    //                 throw new Error(res.statusText);
    //             }
    //             return res.json();
    //         })
    //         .then((data) => {
    //             return data;
    //         })
    //         .catch((error) => {
    //             throw error;
    //         });
    // }

    async getCall(url, query) {
        url = new URL(this.baseDomain + url);
        if (query) {
            url.search = new URLSearchParams(query);
        }
        let options = {
            headers: this.myHeader,
            // mode: 'no-cors',
        };
        const request = await fetch(url, options);
        const data = await request.json();
        return data;
    }
    /**
     *
     * @param {URL} url Url to send data to.
     * @param {File} files Files to be upload
     * @param {Object} userEid UserId for the files.
     */
    // uploadFile(url, files, userEid) {
    //     const formData = new FormData();
    //     formData.append('file', files);
    //     if (userEid) {
    //         this.myHeader.set('usereid', userEid);
    //     }
    //     // this.myHeader.set('Content-Type', 'multipart/form-data');
    //     let options = {
    //         method: 'POST',
    //         body: formData,
    //     };
    //     return fetch(url, options)
    //         .then((res) => {
    //             if (!res.ok) {
    //                 throw new Error(res.statusText);
    //             }
    //             return res.json();
    //         })
    //         .then((data) => {
    //             return data;
    //         })
    //         .catch((error) => {
    //             throw error;
    //         });
    // }
}
