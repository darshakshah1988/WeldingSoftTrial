import axios from "axios";
import { API_URL } from "./constants";
import { isEmpty } from "lodash";
import { getItem } from "./localStorageHelpers";

export const getCall = async ({ path, queryParams = {} }) => {
  let [isApiConnectionSucceess, data] = [false, {}];
  const token = getItem({key:"WeldersUserInfo"})
  let pathParams = isEmpty(queryParams)
    ? ""
    : Object.entries(queryParams).reduce(
      (querystring, [queryParamsKey, queryParamsValue]) =>
        `${querystring}&${queryParamsKey}=${queryParamsValue}`,
      "?"
    );
  const API_PATH = API_URL + path + pathParams;
  try {
    let response = await axios.get(API_PATH, { headers: { "Authorization": `Bearer ${token}` } });
    return { isApiConnectionSucceess: true, data: response.data };
  } catch (e) {
    return { isApiConnectionSucceess, data };
  }
};
export const putCall = async ({ path, updatedData }) => {
  let [isApiConnectionSucceess, data] = [false, {}];
  const token = getItem({key:"WeldersUserInfo"})
  const API_PATH = API_URL + path;
  try {
    let response = await axios.put(API_PATH, {
      data: { updatedData },
    }, { headers: { "Authorization": `Bearer ${token}` } });
    return { isApiConnectionSucceess: true, data: response.data };
  } catch (e) {
    return { isApiConnectionSucceess, data };
  }
};

export const postCall = async ({ path, Data }) => {
  let [isApiConnectionSucceess, data] = [false, {}];
  const token = getItem({key:"WeldersUserInfo"})
  const API_PATH = API_URL + path;
  try {
    let response = await axios.post(API_PATH, {
      data: { Data },
    }, { headers: { "Authorization": `Bearer ${token}` } });
    return { isApiConnectionSucceess: true, data: response.data };
  } catch (e) {
    return { isApiConnectionSucceess, data };
  }
};
