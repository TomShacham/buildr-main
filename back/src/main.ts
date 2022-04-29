import {Page} from "../../shared/models/core";
import {route, Routes} from "@http4t/bidi/routes";
import {request} from "@http4t/bidi/requests";
import {json} from "@http4t/bidi/lenses/JsonLens";
import {buildRouter} from "@http4t/bidi/router";
import {buildClient} from "@http4t/bidi/client";
import {NodeServer} from "@http4t/node/server";
import {path} from "@http4t/bidi/paths";
import {v} from "@http4t/bidi/paths/variables";
import {PathMatcher} from "@http4t/bidi/paths/PathMatcher";

export class MobilePage implements Page {
  name = "first test";
}

interface User {
  name: string,
  age: number
}

type Api = {
  example: () => Promise<{ result: string }>,
  getUser: (user: { username: string }) => Promise<User>
}

const routes: Routes<Api> = {
  getUser: route(
    request('GET', path(
      {username: v.segment},
      () => [{key: "username"}])),
    json()
  ),
  example: route(
    request('GET', "/some/path"),
    json()
  )
};


async function example(): Promise<{ result: string }> {
  return {result: "hello world"}
}

const users = [{
  name: "Tom",
  age: 20
}];

async function getUser(by: { username: string }): Promise<User | undefined> {
  return users.find(it => it.name === by.username)
}

const server = buildRouter(routes, {example, getUser});
export const backendClient = buildClient(routes, server);

const live = NodeServer.start(server, {port: 3000})
backendClient.getUser({username: "Tom"}).then(result => console.log(result));


