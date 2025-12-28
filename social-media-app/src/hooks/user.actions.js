import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosService from "../helpers/axios"; // Import the axios instance

const baseURL = "http://localhost:8000/api";

// Утилиты без хуков — можно вызывать где угодно
export const getAccessTokenRaw = () => {
  const auth = JSON.parse(localStorage.getItem("auth") || "null");
  return auth?.access || null;
};

export const getRefreshTokenRaw = () => {
  const auth = JSON.parse(localStorage.getItem("auth") || "null");
  return auth?.refresh || null;
};

export const getUserRaw = () => {
  const auth = JSON.parse(localStorage.getItem("auth") || "null");
  return auth?.user || null;
};

export const updateAccessToken = (token) => {
  let auth = JSON.parse(localStorage.getItem("auth"));
  auth.access = token;
  localStorage.setItem("auth", JSON.stringify(auth));
};

function useUserActions() {
  const navigate = useNavigate();

  const setUserData = (res) => {
    localStorage.setItem(
      "auth",
      JSON.stringify({
        access: res.data.access,
        refresh: res.data.refresh,
        user: res.data.user,
      })
    );
  };

  const login = (data) => {
    return axios.post(`${baseURL}/auth/login/`, data).then((res) => {
      setUserData(res);
      navigate("/");
    });
  };

  const register = (data) => {
    return axios.post(`${baseURL}/auth/register/`, data).then((res) => {
      setUserData(res);
      navigate("/");
    });
  };

  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/login/");
  };

  const getUser = () => {
    return getUserRaw();
  };

  const getAccessToken = () => {
    return getAccessTokenRaw();
  };

  const getRefreshToken = () => {
    return getRefreshTokenRaw();
  };

  const edit = (data, userId) => {
    return axiosService.patch(`/users/${userId}/`, data).then((res) => {
      localStorage.setItem(
        "auth",
        JSON.stringify({
          access: getAccessTokenRaw(),
          refresh: getRefreshTokenRaw(),
          user: res.data,
        })
      );
      return res;
    });
  };

  return {
    login,
    logout,
    getUser,
    getAccessToken,
    getRefreshToken,
    register,
    edit,
  };
}

export default useUserActions;
