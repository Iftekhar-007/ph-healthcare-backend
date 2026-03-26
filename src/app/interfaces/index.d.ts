import { IORequestUser } from "./requestUser.interface";

declare global {
  namespace Express {
    interface Request {
      user: IORequestUser;
    }
  }
}
