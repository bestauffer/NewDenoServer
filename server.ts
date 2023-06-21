// import {Application} from "./deps.ts"
// import router from "./routes.ts"
// import express, { NextFunction, Request, Response} from "npm:express";


// const app = express();
// const port: number = Number(Deno.env.get("PORT")) || 3000;
// //app.use(errorHandler);
// // app.use(router.routes());
// // app.use(router.allowedMethods());
// //app.use(_404);

// // app.listen(`${HOST}:${PORT}`);
// const regLogger = function (req: Request, res: Response, next: NextFunction){
//     console.info(`${req.method} request to "${req.url}" by ${req.hostname}`);
//     next();
// };

// app.use(regLogger);
// app.get("/", (req: Request, res: Response): void => {
//     res.send("Hello World");
// });

// app.listen(port, () => {
//     console.log(`listening on ${port} ... `);
// })

// @deno-types="npm:@types/express@4"
import express, { NextFunction, Request, Response } from "npm:express";
import demoData from "./data_blob.json" assert { type: "json" };

const app = express();
const port = Number(Deno.env.get("PORT")) || 3000;

const reqLogger = function (req: Request, _res: Response, next: NextFunction) {
  console.info(`${req.method} request to "${req.url}" by ${req.hostname}`);
  next();
};

app.use(reqLogger);

app.get("/", (_req, res) => {
    res.send("Hello, this message is from a Express Deno server");
  });

app.get("/users", (_req, res) => {
  res.status(200).json(demoData.users);
});

app.get("/users/:id", (req, res) => {
  const idx = Number(req.params.id);
  for (const user of demoData.users) {
    if (user.id === idx) {
      res.status(200).json(user);
    }
  }
  res.status(400).json({ msg: "User not found" });
});

app.listen(port, () => {
  console.log(`Listening on ${port} ...`);
});