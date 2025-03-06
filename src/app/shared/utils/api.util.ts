import { environment } from "../../../environments/environment";

export class ApiUtil {
    public static getPreparedUrl(url: string, params: Map<string, string>) {
        if(params?.size > 0) {
            params.forEach((value, key) => {
                const regEx = new RegExp(`{(${key})}`,'g');
                url = url.replace(regEx, value);
            })
        }
        return environment.apiUrl + url;
    }

    public static getApiUrl(url: string) {
        return environment.apiUrl + url;
    }
}