import Fastify, { RouteShorthandOptions as RouteOptions } from "fastify";
import axios from "axios";
import cors from "fastify-cors";

const fastify = Fastify({
    logger: true,
});

fastify.register(cors);

const options: RouteOptions = {
    schema: {
        querystring: {
            type: "object",
            properties: {
                url: {
                    type: "string",
                },
            },
        },
        response: {
            200: {
                type: "string",
            },
        },
    },
};

fastify.get("/", options, async (req, res) => {
    const { url } = req.query as { [key: string]: string };

    let parsed;
    try {
        parsed = new URL(String(url));
    } catch {
        throw {
            status: 400,
            message: "Not an url",
        };
    }

    try {
        const { data } = await axios.get(parsed.href);
        return data;
    } catch {
        throw {
            status: 500,
            message: `There was a problem sending a request to this url - ${parsed.href}`,
        };
    }
});

fastify.listen(process.env.PORT || 3000, "0.0.0.0", (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
});
