import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { FastifyJWT } from "@fastify/jwt";
import { HTTP_STATUS_UNAUTHORIZED } from "../config/httpStatus.config";

// using declaration merging, add your plugin props to the appropriate fastify interfaces
// if prop type is defined here, the value will be typechecked when you call decorate{,Request,Reply}
declare module "fastify" {
  interface FastifyInstance {
    jwtAuthenticate: (req: FastifyRequest, reply: FastifyReply) => void;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: number;
      email: string;
      name: string;
      isSuperUser: boolean;
    };
  }
}

// define options
interface MyPluginOptions {
  // myPluginOption: string;
}

const jwtAuthenticate: FastifyPluginAsync<MyPluginOptions> = async (fastify, options) => {
  fastify.decorate("jwtAuthenticate", async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.cookies.access_token;
    if (!token) {
      return reply.status(HTTP_STATUS_UNAUTHORIZED).send({ message: "Authentication required" });
    }
    try {
      // here decoded will be a different type by default but we want it to be of user-payload type
      const decoded = req.jwt.verify<FastifyJWT["user"]>(token);
      req.user = decoded;
    } catch (err) {
      reply.clearCookie("access_token");
      return reply.status(HTTP_STATUS_UNAUTHORIZED).send({ message: "Session expired!" });
    }
  });
};

export default fp(jwtAuthenticate);
