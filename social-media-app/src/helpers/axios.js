import axios from "axios";
import { getAccessTokenRaw, getRefreshTokenRaw, updateAccessToken } from "../hooks/user.actions";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
});

api.interceptors.request.use((config) => {
    const token = getAccessTokenRaw();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Проверяем, что ошибка - 401 Unauthorized, и что это не повторный запрос
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = getRefreshTokenRaw();
                const response = await axios.post(`${api.defaults.baseURL}/auth/refresh/`, {
                    refresh: refreshToken,
                });
                const { access } = response.data;

                updateAccessToken(access);

                // Обновляем заголовок авторизации и повторяем исходный запрос
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Если обновление токена не удалось, перенаправляем на страницу входа
                window.location.href = '/login/';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const fetcher = (url) => api.get(url).then((res) => res.data);

export default api;
