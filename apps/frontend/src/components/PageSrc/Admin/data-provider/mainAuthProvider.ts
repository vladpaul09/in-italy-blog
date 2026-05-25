import { AuthProvider } from "react-admin";
import config from "@/config";
import httpClient from "./httpClient";

const apiUrl = config.admin.authDataProviderUrlBase;

const mainAuthProvider: AuthProvider = {
  // called when the user attempts to log in
  login: async ({ username, password }) => {
    const response = await httpClient(`${apiUrl}/login`, {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      credentials: "include",
    });
    if (response.ok) {
      localStorage.setItem(config.admin.localStorageUserPermissionsKey, JSON.stringify(await response.json()));
      return;
    }
    if (response.headers.get("content-type") !== "application/json") {
      throw new Error(response.statusText);
    }

    const json = await response.json();
    const error = json.errors.non_field_errors;

    throw new Error(error || response.statusText);
  },
  logout: async () => {
    await httpClient(`${apiUrl}/logout`, {
      method: "POST",
      body: JSON.stringify({}),
      credentials: "include",
    });
    localStorage.removeItem(config.admin.localStorageUserPermissionsKey);
    return Promise.resolve();
  },
  /* called when the API returns an error */
  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      return Promise.reject();
    }
    /* other error code (404, 500, etc): no need to log out */
    return Promise.resolve();
  },
  // called when the user navigates to a new location, to check for authentication
  checkAuth: async () => {
    const response = await httpClient(`${apiUrl}/check-auth`, {
      method: "POST",
      body: JSON.stringify({}),
      credentials: "include",
    });
    if (response.ok) {
      return Promise.resolve();
    }
    return Promise.reject({ message: "Session expired!" });
  },
  // called when the user navigates to a new location, to check for permissions / roles
  getPermissions: async () => {
    return Promise.resolve();
  },
  canAccess: async ({ resource, action }) => {
    const permissions: Array<{ action: string; resource: string }> = JSON.parse(
      localStorage.getItem(config.admin.localStorageUserPermissionsKey) || "[]"
    );
    return permissions.filter((p) => p.action === action && p.resource === resource).length > 0;
  },
};

export default mainAuthProvider;
