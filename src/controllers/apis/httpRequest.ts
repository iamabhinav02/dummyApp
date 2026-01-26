import axios, { AxiosRequestConfig } from 'axios';
import DeviceInfo from 'react-native-device-info';

const axiosClient = axios.create({});

const addHeaders = async (headers: any) => {
  const deviceData = {
    requestId: Date.now(),
    deviceId: DeviceInfo.getDeviceId(),
    version: DeviceInfo.getVersion(),
    brand: DeviceInfo.getBrand(),
    buildId: DeviceInfo.getBuildIdSync(),
    ipAddress: DeviceInfo.getIpAddressSync(),
  };

  return {
    deviceData,
    ...headers,
  };
};

const httpRequest = async (
  baseURL: string,
  url: string,
  params: any,
  method: string,
  headers: any = { 'Content-Type': 'application/json' },
  body?: any,
) => {

  headers = addHeaders(headers);

  const axiosOptions: AxiosRequestConfig = {
    baseURL,
    url,
    params,
    method,
    headers,
    withCredentials: true,
    responseType: 'json',
  };

  if (body) {
    axiosOptions.data = body;
  }

  const startTime = Date.now();

  console.log(`${url}:request`, axiosOptions);

  return axiosClient(axiosOptions)
    .then(response => {
      const latency = Date.now() - startTime;
      console.log(`${url}:latency`, latency);
      console.log(`${url}:response`, response);

      return Promise.resolve(response.data);
    })
    .catch(error => {
      const latency = Date.now() - startTime;
      console.log(`${url}:latency`, latency);
      console.log(`${url}:error`, error);
      return Promise.reject(error);
    });
};

export default httpRequest;
