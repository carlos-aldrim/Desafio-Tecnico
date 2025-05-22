import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 5,
  duration: "30s",
};

const BASE_URL = "http://localhost:3000";

export default function () {
  const categoryPayload = JSON.stringify({ name: `Category${Math.random()}` });
  const headers = { headers: { "Content-Type": "application/json" } };

  const createRes = http.post(
    `${BASE_URL}/categories`,
    categoryPayload,
    headers
  );
  check(createRes, {
    "create category status is 200": (r) => r.status === 200,
  });

  const category = createRes.json();
  const categoryId = category.id;

  const listRes = http.get(`${BASE_URL}/categories`);
  check(listRes, {
    "list categories status is 200": (r) => r.status === 200,
  });

  const getRes = http.get(`${BASE_URL}/categories/${categoryId}`);
  check(getRes, {
    "get category by id status is 200": (r) => r.status === 200,
  });

  const updatePayload = JSON.stringify({
    name: `UpdatedCategory${Math.random()}`,
  });
  const updateRes = http.put(
    `${BASE_URL}/categories/${categoryId}`,
    updatePayload,
    headers
  );
  check(updateRes, {
    "update category status is 200": (r) => r.status === 200,
  });

  const deleteRes = http.del(`${BASE_URL}/categories/${categoryId}`);
  check(deleteRes, {
    "delete category status is 200": (r) => r.status === 200,
  });

  sleep(1);
}
