import { build } from "./helper";

const app = build();


test("some other root test", async () => {
  const res = await app.inject({ url: "/root2" });

  expect(res.json()).toEqual({ root2: true });
});