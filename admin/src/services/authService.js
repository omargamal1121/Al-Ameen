import axios from "axios";

class AuthService {
  constructor() {
    this._interceptorsSetup = false;
    this.isRefreshing = false;
    this.failedQueue = [];
    this.setupInterceptors();
  }

  getApiClient() {
    return axios;
  }

  setupInterceptors() {
    if (this._interceptorsSetup) return;
    this._interceptorsSetup = true;

    axios.defaults.withCredentials = true;

    axios.interceptors.request.use(
      (config) => {
        const token = sessionStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (originalRequest?.skipAuthRefresh) {
          return Promise.reject(error);
        }

        if (error.response?.status === 409) {
          const serverMsg =
            error.response?.data?.message ||
            error.response?.data?.errors?.messages?.[0] ||
            "Conflict error (resource already exists).";

          if (window?.toast) {
            window.toast.error(`❌ ${serverMsg}`);
          }

          return Promise.reject({
            statuscode: 409,
            message: serverMsg,
            responseBody: error.response?.data,
          });
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          const existingToken = sessionStorage.getItem("token");

          if (!existingToken) {
            this.redirectToLogin();
            return Promise.reject(error);
          }

          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(() => axios(originalRequest))
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshToken();

            if (newToken) {
              sessionStorage.setItem("token", newToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              this.processQueue(null, newToken);
              return axios(originalRequest);
            } else {
              this.processQueue(new Error("Token refresh failed"), null);
              this.redirectToLogin();
              return Promise.reject(error);
            }
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            this.redirectToLogin();
            return Promise.reject(error);
          } finally {
            this.isRefreshing = false;
          }
        }

        if (
          error.response?.status !== 401 &&
          error.response?.status !== 409 &&
          error.response?.status !== 404
        ) {
          const serverData = error.response?.data;
          const serverMsg =
            serverData?.responseBody?.message ||
            serverData?.message ||
            (serverData?.errors && Object.values(serverData.errors).flat()[0]) ||
            (typeof serverData === "string" ? serverData : null) ||
            error.message ||
            "An unexpected error occurred.";

          if (window?.toast) {
            window.toast.error(`❌ ${serverMsg}`);
          } else if (window?.showToast) {
            window.showToast(serverMsg, "error");
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async refreshToken() {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const response = await axios.post(
        `${backendUrl}/api/Account/refresh-token`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
          skipAuthRefresh: true,
        }
      );

      if (response.status !== 200) {
        throw new Error(`Refresh failed with status ${response.status}`);
      }

      const data = response?.data;

      const bodyStatusCode =
        data?.statuscode || data?.responseBody?.statuscode || data?.responseBody?.statusCode;
      const bodyMessage = data?.responseBody?.message || data?.message;

      if (bodyStatusCode === 401 || bodyMessage === "Please login again") {
        this.redirectToLogin();
        const authError = new Error(bodyMessage || "Please login again");
        authError.response = { status: 401, data };
        throw authError;
      }

      const newToken =
        data?.token ||
        data?.accessToken ||
        data?.data?.token ||
        data?.data?.accessToken ||
        data?.responseBody?.data?.token ||
        data?.responseBody?.data?.accessToken ||
        (typeof data === "string" ? data : null);

      if (newToken && typeof newToken === "string" && newToken.length > 10) {
        return newToken;
      } else {
        throw new Error("Invalid token response format");
      }
    } catch (error) {
      if (
        error.response?.status === 400 ||
        error.response?.status === 401
      ) {
        this.redirectToLogin();
        const authError = new Error("Refresh token invalid or expired");
        authError.response = {
          ...(error.response || {}),
          status: 401,
        };
        throw authError;
      }
      throw error;
    }
  }

  processQueue(err, token = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
    this.failedQueue = [];
  }

  redirectToLogin() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("roles");

    if (window.showToast) {
      window.showToast("Session expired. Please login again.", "error");
    }

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  }

  async manualRefresh() {
    try {
      const newToken = await this.refreshToken();
      if (newToken) {
        sessionStorage.setItem("token", newToken);
        return newToken;
      }
      return null;
    } catch (error) {
      this.redirectToLogin();
      return null;
    }
  }

  getCurrentToken() {
    return sessionStorage.getItem("token");
  }

  hasValidToken() {
    const token = sessionStorage.getItem("token");
    if (!token || token.length < 10) return false;

    try {
      const parts = token.split(".");
      if (parts.length < 2) return false;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      const exp = payload?.exp;
      if (!exp) return false;
      return Date.now() / 1000 < exp - 30;
    } catch {
      return false;
    }
  }

  async logout() {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const token = sessionStorage.getItem("token");

      if (token) {
        await axios.get(`${backendUrl}/api/Account/logout`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          skipAuthRefresh: true,
        });
      }
    } catch (error) {
      console.warn("Logout API call failed, clearing client state anyway:", error.message);
    } finally {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("roles");
      window.location.href = "/";
    }
  }
}

const authService = new AuthService();

export default authService;
