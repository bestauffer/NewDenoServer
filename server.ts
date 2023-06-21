import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { CorsOptions, oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const loadOriginsFromDataBase = async () => {
  await sleep(3000);
  return ["http://localhost:1234", "http://localhost:3000"];
};

const books = new Map<string, any>();
books.set("1", {
  id: "1",
  title: "Frankenstein",
  author: "Mary Shelley",
});

const corsOptions: CorsOptions = {
  origin: async (requestOrigin) => {
    const origins = await loadOriginsFromDataBase(); // Simulate asynchronous task

    return origins; //  Reflect (enable) the requested origin in the CORS response for this origins
  },
};

const router = new Router();
router.get("/book", oakCors(corsOptions), (context) => {
  context.response.body = Array.from(books.values());
});
router.get("/", oakCors(corsOptions), (context) => {
    context.response.body = {message: "This message is coming from a deno server"};
  });

const app = new Application();
app.use(router.routes());

console.info("CORS-enabled web server listening on port 8000");
await app.listen({ port: 8000 });