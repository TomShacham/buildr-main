import {backendClient, MobilePage} from "../back/src/main";
import {NodeServer} from "@http4t/node/server";
import {HttpHandler, HttpRequest, HttpResponse} from "@http4t/core/contract";
import {notFound, ok} from "@http4t/core/responses";

async function main() {
    const router:HttpHandler = new class implements HttpHandler {
        async handle(request: HttpRequest): Promise<HttpResponse> {
            if (request.uri.path === "/tom") {
                return ok(new MobilePage().name)
            } else {
                return notFound("Que?")
            }
        }
    }
    NodeServer.start(router)
        .then((server) => {
            server.url().then(async (it) => {
                const user = await backendClient.getUser()
                console.log(`started on ${it}`);
                console.log(`user ${JSON.stringify(user)}`);
            })
        })
}


main()