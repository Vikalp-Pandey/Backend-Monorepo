import { DbAdapter } from "@repo/db/adapter";
import { Context } from "hono";
import { getCookie } from "hono/cookie";
import { verifyjwt } from "@repo/utils/jwt";
import User from "@repo/db/schemas/user";

export const me = (db: DbAdapter) => {
  return async (c: Context) => {
    const accessToken = getCookie(c, 'accessToken');
    if (!accessToken) {
      return c.json({ message: "Not authenticated" }, 401);
    }

    const payload = await verifyjwt(accessToken);
    if (!payload) {
      return c.json({ message: "Invalid token" }, 401);
    }

    // .lean() tells the mongoose to skip the heavy mongoose stuff and return a plain JS object, thereby making the query faster.
    const user = await User.findOne({email:payload.email}).lean();
   
    console.log(user);
    if (!user) {
      return c.json({ message: "User not found" }, 404);
    }

    return c.json({
      data: user
    });
  };
};
