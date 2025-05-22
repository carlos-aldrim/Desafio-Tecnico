import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 5,
  duration: "30s",
};

const BASE_URL = "http://localhost:3000";

export default function () {
  const userPayload = JSON.stringify({
    name: `User${Math.random()}`,
    email: `user${Math.random()}@test.com`,
    password: "123456",
  });

  const jsonHeaders = {
    headers: { "Content-Type": "application/json" },
  };

  const userRes = http.post(`${BASE_URL}/users`, userPayload, jsonHeaders);
  check(userRes, {
    "create user status is 201": (r) => r.status === 201,
  });

  const user = userRes.json();

  const loginPayload = JSON.stringify({
    email: user.email,
    password: "123456",
  });

  const loginRes = http.post(`${BASE_URL}/login`, loginPayload, jsonHeaders);
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
    `${BASE_URL}/categories`,
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

  const videoRes = http.post(`${BASE_URL}/videos`, videoPayload, jsonHeaders);
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
    `${BASE_URL}/comments`,
    commentPayload,
    jsonHeaders
  );
  check(commentRes, {
    "create comment status is 201": (r) => r.status === 201,
  });

  const getAllCommentsRes = http.get(`${BASE_URL}/comments`);
  check(getAllCommentsRes, {
    "get all comments status is 200": (r) => r.status === 200,
  });

  const comment = commentRes.json();
  const commentId = comment.id;

  const listCommentsRes = http.get(`${BASE_URL}/videos/${videoId}/comments`);
  check(listCommentsRes, {
    "list comments by video status is 200": (r) => r.status === 200,
  });

  const deleteCommentRes = http.del(`${BASE_URL}/comments/${commentId}`);
  check(deleteCommentRes, {
    "delete comment status is 204": (r) => r.status === 204,
  });

  const deleteVideoRes = http.del(`${BASE_URL}/videos/${videoId}`);
  check(deleteVideoRes, {
    "delete video status is 200": (r) => r.status === 200,
  });

  const deleteCategoryRes = http.del(`${BASE_URL}/categories/${categoryId}`);
  check(deleteCategoryRes, {
    "delete category status is 200": (r) => r.status === 200,
  });

  const deleteUserRes = http.del(`${BASE_URL}/users/${user.id}`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  check(deleteUserRes, {
    "delete user status is 200": (r) => r.status === 200,
  });

  sleep(1);
}
