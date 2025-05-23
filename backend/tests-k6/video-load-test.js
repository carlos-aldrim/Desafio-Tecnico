import http from "k6/http";
import { check, sleep } from "k6";
import { API_BASE } from "./config/api.js";

export const options = {
  vus: 5,
  duration: "30s",
};

export default function () {
  const categoryPayload = JSON.stringify({ name: `Category${Math.random()}` });
  const headers = { headers: { "Content-Type": "application/json" } };

  const categoryRes = http.post(`${API_BASE}/categories`, categoryPayload, headers);
  check(categoryRes, {
    "create category status is 200": (r) => r.status === 200,
  });

  const category = categoryRes.json();
  const categoryId = category.id;

  const videoPayload = JSON.stringify({
    title: `Video ${Math.random()}`,
    description: "A performance test video",
    url: "http://video.url/test.mp4",
    categoryId,
  });

  const createRes = http.post(`${API_BASE}/videos`, videoPayload, headers);
  check(createRes, {
    "create video status is 200": (r) => r.status === 200,
  });

  const video = createRes.json();
  const videoId = video.id;

  const listRes = http.get(`${API_BASE}/videos`);
  check(listRes, {
    "list videos status is 200": (r) => r.status === 200,
  });

  const getRes = http.get(`${API_BASE}/videos/${videoId}`);
  check(getRes, {
    "get video by id status is 200": (r) => r.status === 200,
  });

  const updatePayload = JSON.stringify({
    title: "Updated Title",
    description: "Updated description",
    url: "http://video.url/updated.mp4",
    categoryId,
  });

  const updateRes = http.put(`${API_BASE}/videos/${videoId}`, updatePayload, headers);
  check(updateRes, {
    "update video status is 200": (r) => r.status === 200,
  });

  const deleteRes = http.del(`${API_BASE}/videos/${videoId}`);
  check(deleteRes, {
    "delete video status is 200": (r) => r.status === 200,
  });

  const deleteCategoryRes = http.del(`${API_BASE}/categories/${categoryId}`);
  check(deleteCategoryRes, {
    "delete category status is 200": (r) => r.status === 200,
  });

  sleep(1);
}
