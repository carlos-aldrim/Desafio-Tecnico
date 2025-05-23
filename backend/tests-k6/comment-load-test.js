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

  const jsonHeaders = {
    headers: { "Content-Type": "application/json" },
  };

  const userRes = http.post(`${API_BASE}/users`, userPayload, jsonHeaders);
  check(userRes, {
    "create user status is 201": (r) => r.status === 201,
  });

  const user = userRes.json();

  const loginPayload = JSON.stringify({
    email: user.email,
    password: "123456",
  });

  const loginRes = http.post(`${API_BASE}/login`, loginPayload, jsonHeaders);
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

  const categoryPayload = JSON.stringify({
    name: `Category${Math.random()}`,
  });

  const categoryRes = http.post(
    `${API_BASE}/categories`,
    categoryPayload,
    jsonHeaders
  );
  check(categoryRes, {
    "create category status is 200": (r) => r.status === 200,
  });

  const category = categoryRes.json();
  const categoryId = category.id;

  const videoPayload = JSON.stringify({
    title: `Video ${Math.random()}`,
    description: "A test video",
    url: "http://video.url/test.mp4",
    categoryId,
  });

  const videoRes = http.post(`${API_BASE}/videos`, videoPayload, jsonHeaders);
  check(videoRes, {
    "create video status is 200": (r) => r.status === 200,
  });

  const video = videoRes.json();
  const videoId = video.id;

  const commentPayload = JSON.stringify({
    userId: user.id,
    videoId: videoId,
    message: "This is a load test comment",
  });

  const commentRes = http.post(
    `${API_BASE}/comments`,
    commentPayload,
    jsonHeaders
  );
  check(commentRes, {
    "create comment status is 201": (r) => r.status === 201,
  });

  const getAllCommentsRes = http.get(`${API_BASE}/comments`);
  check(getAllCommentsRes, {
    "get all comments status is 200": (r) => r.status === 200,
  });

  const comment = commentRes.json();
  const commentId = comment.id;

  const listCommentsRes = http.get(`${API_BASE}/videos/${videoId}/comments`);
  check(listCommentsRes, {
    "list comments by video status is 200": (r) => r.status === 200,
  });

  const deleteCommentRes = http.del(`${API_BASE}/comments/${commentId}`);
  check(deleteCommentRes, {
    "delete comment status is 204": (r) => r.status === 204,
  });

  const deleteVideoRes = http.del(`${API_BASE}/videos/${videoId}`);
  check(deleteVideoRes, {
    "delete video status is 200": (r) => r.status === 200,
  });

  const deleteCategoryRes = http.del(`${API_BASE}/categories/${categoryId}`);
  check(deleteCategoryRes, {
    "delete category status is 200": (r) => r.status === 200,
  });

  const deleteUserRes = http.del(`${API_BASE}/users/${user.id}`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  check(deleteUserRes, {
    "delete user status is 200": (r) => r.status === 200,
  });

  sleep(1);
}
