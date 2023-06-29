import { Application, Router } from "https://deno.land/x/oak@v12.5.0/mod.ts";
import { CorsOptions, oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import "https://deno.land/x/dotenv@v3.2.2/load.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import "https://deno.land/x/dotenv@v3.2.2/load.ts";
const client = new SmtpClient();
const { EMAIL, PORT, EMAIL_PASSWORD, RECEIVING_EMAIL } = Deno.env.toObject();

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const loadOriginsFromDataBase = async () => {
  await sleep(3000);
  return ["https://bestauffer.github.io", "http://localhost:3000"];
};

const myPoster = async () => {
  try{
    await client.connectTLS(connectConfig);
    //console.log(EMAIL);
      await client.send({
        from: EMAIL,
        to: RECEIVING_EMAIL,
        subject: "Welcome!",
        content: "Hi from Test!",
      });
    
      await client.close();
  }
  catch{}
 
}

const books = new Map<string, any>();
books.set("1", {
  id: "1",
  title: "Frankenstein",
  author: "Mary Shelley",
});

const connectConfig: any = {
  hostname: "smtp.gmail.com",
  port: 465,
  secure: true,
  username: EMAIL,
  password: EMAIL_PASSWORD,
};

const corsOptions: CorsOptions = {
  origin: async () => {
    const origins = await loadOriginsFromDataBase(); // Simulate asynchronous task

    return origins; //  Reflect (enable) the requested origin in the CORS response for this origins
  },
};
//const PORTO:string = Deno.env.get('PORT')!;
const PORTO: number = parseInt(PORT);

const router = new Router();
router.get("/book", oakCors(), (context) => {
  context.response.body = Array.from(books.values());
});
router.get("/", oakCors(), (context) => {
  context.response.body = { message: "This message is coming from a get call on deno server" };
});
router.get('/email', oakCors(), (context) => {
  myPoster();
  context.response.body = { message: "This message is coming from a post call on a deno server" };

});

const app = new Application();
app.use(router.routes());

console.info(`CORS-enabled web server listening on port ${PORTO}`);
await app.listen({ port: PORTO });