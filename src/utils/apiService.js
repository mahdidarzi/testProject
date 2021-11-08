import Axios from "axios";
// import CustomToast from "../common/toastGenerator";

let userToken;

if (typeof Storage !== "undefined") {
  //use the local
  userToken = localStorage.getItem("access_token");
}

export const CONFIG = {
  baseUrl: {
    serverUrl: "https://api.irannimrokh.ir", // https://api.irannimrokh.ir/api"https://api.testica.ir",
    real: "https://api.irannimrokh.ir/api", //"https://api.testica.ir/api",
    imgUrl: "https://api.irannimrokh.ir", //"https://api.testica.ir/api",

    mock: "",
  },

  // baseUrl: {
  //   serverUrl: "https://api.testica.ir/api",
  //   real: "https://api.testica.ir/api",
  //   imgUrl: "https://api.testica.ir/api", //"",

  //   mock: "",
  // },

  clientSecret: {
    headerName: "client-secret",
    value: "",
  },
  clientId: {
    headerName: "client-id",
    value: "",
  },
  accessToken: {
    localStorageName: "access_token",
    headerName: "Authorization",
    prefix: "Bearer ",
  },
  refreshToken: {
    active: false,
    url: "",
    method: "POST",
    token: {
      localStorageName: "refresh_token",
      headerName: "refresh-token",
      prefix: "",
    },
    onStatus: [401, 403],
  },
};

// const router = useRouter();
// const userToken = localStorage.getItem("access_token");

/* For handling refresh token on certain statuses */
const refreshTokenHandler = () => {
  const myHeader = {
    [CONFIG.refreshToken.token.headerName]: localStorage.getItem(
      CONFIG.refreshToken.token.localStorageName
    ),
  };
  console.log(" CONFIG.refreshToken.url", CONFIG.refreshToken.url);

  APIService(
    CONFIG.refreshToken.url,
    CONFIG.refreshToken.method,
    {
      onSuccess: (res, extraData) => {
        // save access token and refresh token later
        console.log(123);
      },
      onFail: (err, extraData) => {
        // some activities
      },
    },
    {
      headers: myHeader,
    },
    {
      deleteAccessTokenAfterRequest_fail: true,
      useClientSecret: true,
      disableRefreshToken: true,
    }
  );
};

/**
 * Full useable APIService (v2)
 * @param {String} url API call url. This will added to the base url
 * @param {String} method API call methods. Should be `GET`, `POST`, `PUT`, `DELETE` or `PATCH`
 * @param callback An object that should have `onSuccess` function and `onFail` function. For passing extra data to the functions, add `extraData` field. Functions receive this data as second props
 * @param requestData An object which use for passing `headers`, `body`, `params` to request. For add other axios options, put them in `options`
 * @param requestOptions An object for change APIService behavior.
 */
//  const router = useRouter();
export const APIService = (
  url,
  method,
  callback = {
    onSuccess: () => {},
    onFail: () => {},
    extraData: null,
  },
  requestData = {
    headers: {},
    body: {},
    params: {},
    options: {},
  },
  requestOptions = {
    toast: {
      success: "",
      fail: "",
    },
    useClientSecret: false,
    disableClientId: false,
    useAccessToken: userToken ? true : false, //false,
    disableLogOnError: false,
    deleteAccessTokenAfterRequest_success: false,
    deleteAccessTokenAfterRequest_fail: false,
    useMockBaseURL: false,
    disableRefreshToken: false,
    useServerUrl: false,
    // router: false,
  }
) => {
  // console.log("userToken>>>>", userToken);
  // const router = useRouter();
  let api,
    headers = {},
    body = {},
    params = {},
    options = {},
    extraData = null;

  /* input validation */
  /* url validation */
  if (url === null || url === undefined) {
    throw "APIService ERROR: url is not defined correctly";
  }
  /* method validation */
  if (
    method !== "GET" &&
    method !== "POST" &&
    method !== "PUT" &&
    method !== "DELETE" &&
    method !== "PATCH"
  ) {
    throw "API CALL ERROR: API call method is not defined correctly";
  }

  /* callback properties validation */
  if (!callback) {
    throw "APIService ERROR: callback object not defined";
  }
  if (callback.onSuccess === undefined) {
    throw "APIService ERROR: 'onSuccess' callback not defined";
  }
  if (callback.onFail === undefined) {
    throw "APIService ERROR: 'onFail' callback not defined";
  }
  if (callback.extraData) {
    extraData = callback.extraData;
  }

  if (requestData) {
    if (requestData.headers) {
      headers = requestData.headers;
    }
    if (requestData.body) {
      body = requestData.body;
    }
    if (requestData.params) {
      params = requestData.params;
    }
    if (requestData.options) {
      options = requestData.options;
    }
  }

  /* modify request headers */
  if (requestOptions.useClientSecret) {
    headers[CONFIG.clientSecret.headerName] = CONFIG.clientSecret.value;
  }
  if (requestOptions.useAccessToken) {
    headers[CONFIG.accessToken.headerName] =
      CONFIG.accessToken.prefix +
      localStorage.getItem(CONFIG.accessToken.localStorageName);
  }

  /* if client id exist in CONFIG, we send it by request */
  if (CONFIG.clientId.value !== "" && !requestOptions.disableClientId) {
    headers[CONFIG.clientId.headerName] = CONFIG.clientId.value;
  }

  api = Axios.create({
    baseURL: requestOptions.useMockBaseURL
      ? CONFIG.baseUrl.mock
      : requestOptions.useServerUrl
      ? CONFIG.baseUrl.serverUrl
      : CONFIG.baseUrl.real,
    headers: headers,
    params: params,
    // data: body,
    ...options,
  });

  let response;

  switch (method) {
    case "GET":
      response = api.get(url);
      break;

    case "POST":
      response = api.post(url, body);
      break;

    case "PUT":
      response = api.put(url, body);
      break;

    case "DELETE":
      response = api.delete(url);
      break;

    case "PATCH":
      response = api.patch(url, body);
      break;

    default:
      return;
  }

  response
    .then((res) => {
      /* do the magic */
      if (requestOptions.toast && requestOptions.toast.success !== "") {
        CustomToast(requestOptions.toast.success, "success");
      }
      // if (res.status === 302) {
      //   Router.push("/dashboard/courses");
      // }
      // console.log("router>>>", requestOptions.router);
      console.log("res >>>", res);

      if (requestOptions.deleteAccessTokenAfterRequest_success) {
        localStorage.removeItem(CONFIG.accessToken.localStorageName);
      }
      return callback.onSuccess(res, extraData);
    })
    .catch((err) => {
      const errorResponse = err.response;
      let reportData = {
        _refresh_token_process: false,
      };
      console.log("erorr >>>", err.response);
      if (CONFIG.refreshToken.active && !requestOptions.disableRefreshToken) {
        for (let i = 0; i < CONFIG.refreshToken.onStatus.length; i++) {
          const status = CONFIG.refreshToken.onStatus[i];
          if (errorResponse && errorResponse.status === status) {
            /* do refresh token functionality */
            reportData._refresh_token_process = true;
            refreshTokenHandler();
            /* then break the loop */
            break;
          }
        }
      }

      /* take a rest and then fix error :)) */
      if (requestOptions.toast && requestOptions.toast.fail !== "") {
        CustomToast(requestOptions.toast.fail, "error");
      }
      // if (errorResponse && errorResponse.data && errorResponse.data.message) {
      //     CustomToast(errorResponse.data.message.msg, errorResponse.data.message.type);
      // }
      if (requestOptions.deleteAccessTokenAfterRequest_fail) {
        localStorage.removeItem(CONFIG.accessToken.localStorageName);
      }
      if (!requestOptions.disableLogOnError) {
        console.error(err);
      }
      if (
        err.response &&
        err.response.data &&
        err.response.data.error &&
        err.response.data.error.message
      ) {
        // console.log(err.response);
        CustomToast(err.response.data.error.message, "error");
      }
      return callback.onFail(err, { ...extraData, ...reportData });
    });
};

/**
 * Full useable async APIService (v1)
 * @param {String} url API call url. This will added to the base url
 * @param {String} method API call methods. Should be `GET`, `POST`, `PUT`, `DELETE` or `PATCH`
 * @param callback An object that should have `onSuccess` function and `onFail` function. For passing extra data to the functions, add `extraData` field. Functions receive this data as second props
 * @param requestData An object which use for passing `headers`, `body`, `params` to request. For add other axios options, put them in `options`
 * @param requestOptions An object for change APIService behavior.
 */

export const AsyncAPIService = async (
  url,
  method,
  callback = {
    onSuccess: () => {},
    onFail: () => {},
    extraData: null,
  },
  requestData = {
    headers: {},
    body: {},
    params: {},
    options: {},
  },
  requestOptions = {
    toast: {
      success: "",
      fail: "",
    },
    useClientSecret: false,
    disableClientId: false,
    useAccessToken: userToken ? true : false, //false,
    disableLogOnError: false,
    deleteAccessTokenAfterRequest_success: false,
    deleteAccessTokenAfterRequest_fail: false,
    useMockBaseURL: false,
    disableRefreshToken: false,
  }
) => {
  let api,
    headers = {},
    body = {},
    params = {},
    options = {},
    extraData = null;

  /* input validation */
  /* url validation */
  if (url === null || url === undefined) {
    throw "APIService ERROR: url is not defined correctly";
  }

  /* method validation */
  if (
    method !== "GET" &&
    method !== "POST" &&
    method !== "PUT" &&
    method !== "DELETE" &&
    method !== "PATCH"
  ) {
    throw "API CALL ERROR: API call method is not defined correctly";
  }

  /* callback properties validation */
  if (!callback) {
    throw "APIService ERROR: callback object not defined";
  }
  if (callback.onSuccess === undefined) {
    throw "APIService ERROR: 'onSuccess' callback not defined";
  }
  if (callback.onFail === undefined) {
    throw "APIService ERROR: 'onFail' callback not defined";
  }
  if (callback.extraData) {
    extraData = callback.extraData;
  }

  if (requestData) {
    if (requestData.headers) {
      headers = requestData.headers;
    }
    if (requestData.body) {
      body = requestData.body;
    }
    if (requestData.params) {
      params = requestData.params;
    }
    if (requestData.options) {
      options = requestData.options;
    }
  }

  /* modify request headers */
  if (requestOptions.useClientSecret) {
    headers[CONFIG.clientSecret.headerName] = CONFIG.clientSecret.value;
  }
  if (requestOptions.useAccessToken) {
    headers[CONFIG.accessToken.headerName] =
      CONFIG.accessToken.prefix +
      localStorage.getItem(CONFIG.accessToken.localStorageName);
  }

  /* if client id exist in CONFIG, we send it by request */
  if (CONFIG.clientId.value !== "" && !requestOptions.disableClientId) {
    headers[CONFIG.clientId.headerName] = CONFIG.clientId.value;
  }

  /* create axios instance */
  api = Axios.create({
    baseURL: requestOptions.useMockBaseURL
      ? CONFIG.baseUrl.mock
      : CONFIG.baseUrl.real,
    headers: headers,
    params: params,
    data: method !== "GET" ? body : {},
    ...options,
  });

  let response;

  try {
    switch (method) {
      case "GET":
        response = await api.get(url);
        break;

      case "POST":
        response = await api.post(url);
        break;

      case "PUT":
        response = await api.put(url);
        break;

      case "DELETE":
        response = await api.delete(url);
        break;

      case "PATCH":
        response = await api.patch(url);
        break;

      default:
        return;
    }

    /* do the magic */
    if (requestOptions.toast && requestOptions.toast.success !== "") {
      CustomToast(requestOptions.toast.success, "success");
    }
    // if (res.data && res.data.message) {
    //     CustomToast(res.data.message.msg, res.data.message.type);
    // }
    if (requestOptions.deleteAccessTokenAfterRequest_success) {
      localStorage.removeItem(CONFIG.accessToken.localStorageName);
    }
    return callback.onSuccess(response, extraData);
  } catch (err) {
    const errorResponse = err.response;
    let reportData = {
      _refresh_token_process: false,
    };

    if (CONFIG.refreshToken.active && !requestOptions.disableRefreshToken) {
      for (let i = 0; i < CONFIG.refreshToken.onStatus.length; i++) {
        const status = CONFIG.refreshToken.onStatus[i];
        if (errorResponse && errorResponse.status === status) {
          /* do refresh token functionality */
          reportData._refresh_token_process = true;
          refreshTokenHandler();
          /* then break the loop */
          break;
        }
      }
    }

    /* take a rest and then fix error :)) */
    if (requestOptions.toast && requestOptions.toast.fail !== "") {
      CustomToast(requestOptions.toast.fail, "error");
    }
    // if (errorResponse && errorResponse.data && errorResponse.data.message) {
    //     CustomToast(errorResponse.data.message.msg, errorResponse.data.message.type);
    // }
    if (requestOptions.deleteAccessTokenAfterRequest_fail) {
      localStorage.removeItem(CONFIG.accessToken.localStorageName);
    }
    if (!requestOptions.disableLogOnError) {
      console.error(err);
    }
    if (
      err.response &&
      err.response.data &&
      err.response.data.error &&
      err.response.data.error.message
    ) {
      // console.log(err.response);
      CustomToast(err.response.data.error.message, "error");
    }
    return callback.onFail(err, { ...extraData, ...reportData });
  }
};
