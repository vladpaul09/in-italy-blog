import { HttpError, fetchUtils } from "react-admin";
import config from "@/config";

interface IValidationErr {
  [key: string]: IValidationErr | Array<string>;
}

interface IRadminValidationErr {
  [key: string]: IRadminValidationErr | string;
}

function httpClientValidation(errors: IValidationErr) {
  let obj: IRadminValidationErr = {};
  for (let key in errors) {
    if (!errors.hasOwnProperty(key)) continue;
    if (Array.isArray(errors[key])) {
      obj[key] = (errors[key] as Array<string>)[0];
    } else {
      if (typeof errors[key] == "object") {
        obj[key] = httpClientValidation(errors[key] as IValidationErr);
      }
    }
  }
  return obj;
}

const httpClient = (url: string, options?: fetchUtils.Options, isFormData?: boolean) => {
  const language = localStorage.getItem("RaStore.locale") || config.fallbackLocale;

  return fetch(url, {
    ...options,
    credentials: "include",
    headers: new Headers({
      Accept: "application/json",
      "Accept-Language": language.replace('"', "").replace('"', ""),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options ? (options.headers ? options.headers : {}) : {}),
    }),
  });
};

export const httpJsonFetchClient = (url: string, options?: fetchUtils.Options, isFormData?: boolean) => {
  return httpClient(url, options, isFormData)
    .then((response) =>
      response.text().then((text) => ({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        body: text,
      })),
    )
    .then(({ status, statusText, headers, body }) => {
      let json;
      try {
        json = JSON.parse(body);
      } catch (e) {
        // not json, no big deal
        json = {};
      }
      if (status < 200 || status >= 300) {
        if (status === 422) {
          return Promise.reject(new HttpError((body && json.message) || status, status, { errors: httpClientValidation(json.errors) }));
        }
        return Promise.reject(new HttpError((json && json.message) || statusText, status, json));
      }
      return Promise.resolve({ status, headers, body, json });
    })
};

export default httpClient;
