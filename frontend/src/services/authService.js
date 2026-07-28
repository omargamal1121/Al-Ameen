import axios from "axios";

class AuthService {
  constructor() {
    this.isRefreshing = false;
    this.failedQueue = [];
    this.listeners = [];
    this.setupInterceptors();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify(token, user = undefined) {
    this.listeners.forEach((listener) => listener({ token, user }));
  }

  setupInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");

        // Don't add Authorization header for refresh token requests
        if (token && !config.url?.includes("/api/Account/refresh-token")) {
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

        if (!originalRequest) return Promise.reject(error);

        // If status is 401 Unauthorized
        if (error.response?.status === 401) {
          // 🆕 Check if user has a token - if not, they're a guest, don't redirect to login
          const currentToken = localStorage.getItem("token");

          // If no token exists, user is a guest - just return the error without redirecting
          if (!currentToken) {
            return Promise.reject(error);
          }

          // If the request that failed WAS the refresh token request, we must login again
          if (originalRequest.url?.includes("/api/Account/refresh-token")) {
            this.logout();
            return Promise.reject(error);
          }

          // If we already tried to retry this request once, don't try again
          if (originalRequest._retry) {
            this.logout();
            return Promise.reject(error);
          }

          // If another request is currently refreshing the token, add this request to the queue
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return axios(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshToken();
            if (newToken) {
              localStorage.setItem("token", newToken);
              this.notify(newToken);

              // Update default headers for subsequent requests
              axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
              originalRequest.headers.Authorization = `Bearer ${newToken}`;

              this.processQueue(null, newToken);
              return axios(originalRequest);
            }
            throw new Error("Could not extract new token");
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            this.logout();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async refreshToken() {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // POST request with refreshToken in body
      const response = await axios.post(
        `${backendUrl}/api/Account/refresh-token`,
        { refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      // If response is not 200, it's considered a failure for refresh
      if (response.status !== 200) {
        throw new Error(`Refresh failed with status ${response.status}`);
      }

      const data = response?.data;
      const newToken =
        data?.token ||
        data?.accessToken ||
        data?.data?.token ||
        data?.data?.accessToken ||
        data?.responseBody?.data?.token ||
        data?.responseBody?.data?.accessToken ||
        (typeof data === "string" ? data : null);

      const newRefreshToken =
        data?.refreshToken ||
        data?.data?.refreshToken ||
        data?.responseBody?.data?.refreshToken;

      if (newToken && typeof newToken === "string" && newToken.length > 20) {
        // Update stored tokens
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }
        console.log("✅ Token refreshed successfully");
        return newToken;
      }
      throw new Error("Invalid token response format");
    } catch (error) {
      console.error("❌ Refresh token failed:", error);
      throw error;
    }
  }

  processQueue(error, token = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) reject(error);
      else resolve(token);
    });
    this.failedQueue = [];
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    this.notify("", null);

    // Redirect only if not already on login page
    if (window.location.pathname !== "/login") {
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
    }
  }

  hasValidToken() {
    const token = localStorage.getItem("token");
    return token && token.length > 20;
  }

  initiateGoogleLogin() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const returnUrl = `${window.location.origin}/google-callback`;
    window.location.href = `${backendUrl}/api/ExternalLogin/Login?provider=Google&returnUrl=${encodeURIComponent(returnUrl)}`;
  }
}

const authService = new AuthService();
export default authService;



