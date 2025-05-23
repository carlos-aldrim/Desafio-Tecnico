import http from "k6/http";
import { check, sleep } from "k6";
import { API_BASE } from "./config/api.js";

export const options = {
  vus: 5,
  duration: "30s",
};

export default function () {
  const userPayload = JSON.stringify({
    name: `User${Math.random()}`,
    email: `user${Math.random()}@test.com`,
    password: "123456",
  });

  const userParams = { headers: { "Content-Type": "application/json" } };

  const createRes = http.post(`${API_BASE}/users`, userPayload, userParams);
  check(createRes, {
    "create user status is 201": (r) => r.status === 201,
  });

  const user = createRes.json();

  const loginPayload = JSON.stringify({
    email: user.email,
    password: "123456",
  });

  const loginRes = http.post(`${API_BASE}/login`, loginPayload, userParams);
  check(loginRes, {
    "login status is 200": (r) => r.status === 200,
  });

  const token = loginRes.json("token");
  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const getUsers = http.get(`${API_BASE}/users`);
  check(getUsers, {
    "list users status is 200": (r) => r.status === 200,
  });

  const profile = http.get(`${API_BASE}/profile`, authHeaders);
  check(profile, {
    "profile status is 200": (r) => r.status === 200,
  });

  const updatePayload = JSON.stringify({ name: "Updated User" });
  const updateRes = http.put(
    `${API_BASE}/users/${user.id}`,
    updatePayload,
    authHeaders
  );
  check(updateRes, {
    "update user status is 200": (r) => r.status === 200,
  });

  const getOne = http.get(`${API_BASE}/users/${user.id}`, authHeaders);
  check(getOne, {
    "get user by id status is 200": (r) => r.status === 200,
  });

  const adminsRes = http.get(`${API_BASE}/admins`, authHeaders);
  check(adminsRes, {
    "get admins status is 200": (r) => r.status === 200 || r.status === 403,
  });

  const deleteHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const deleteRes = http.del(
    `${API_BASE}/users/${user.id}`,
    null,
    deleteHeaders
  );
  check(deleteRes, {
    "delete user status is 200": (r) => r.status === 200,
  });

  sleep(1);
}
