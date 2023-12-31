import { Application, Router } from "https://deno.land/x/oak@v12.5.0/mod.ts";
import { CorsOptions, oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import "https://deno.land/x/dotenv@v3.2.2/load.ts";
const { PORT } = Deno.env.toObject();

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const loadOriginsFromDataBase = async () => {
  await sleep(2000);
  return ["https://bestauffer.github.io", "http://localhost:3000"];
};


const books = new Map<string, any>();
books.set("1", {
  id: "1",
  title: "Frankenstein",
  author: "Mary Shelley",
});


const corsOptions: CorsOptions = {
  origin: async () => {
    const origins = await loadOriginsFromDataBase(); // Simulate asynchronous task

    return origins; //  Reflect (enable) the requested origin in the CORS response for this origins
  },
};
//const PORTO:string = Deno.env.get('PORT')!;
const PORTO: number = parseInt(PORT);

const router = new Router();
router.get("/book", oakCors(corsOptions), (context) => {
  context.response.body = Array.from(books.values());
});
router.get("/", oakCors(corsOptions), (context) => {
  context.response.body = { message: "This message is coming from a get call on deno server" };
});


const app = new Application();
app.use(router.routes());

console.info(`CORS-enabled web server listening on port ${PORTO}`);
await app.listen({ port: PORTO });