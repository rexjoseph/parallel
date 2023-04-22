import { OpenAIStream, OpenAIStreamPayload } from "@/utils/openAIStream";

const SERVER_URL = "https://parallel-ai.herokuapp.com";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing ENV");
}

export const config = {
  runtime: "edge",
};

export default async function POST(req: Request): Promise<Response> {
  const apiKey = req.headers.get("Authorization");

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const requestBody = await req.text();
  const requestBodyJson = JSON.parse(requestBody);
  const prompt = requestBodyJson.prompt;

  if (!prompt) {
    return new Response("No prompt in the request!", { status: 400 });
  }

  const start = new Date()

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are Jared. A helpful paralegal assistant - amongst being a paralegal assistant, you can find company addresses as best you can and also draft legal document samples such as subpoena etc., Answer as concisely as possible. You do not reply to prompts that stray far away from being law or personal assistant related.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    n: 1,
  };

  const [stream, _] = await Promise.all([OpenAIStream(payload), 
    (async () => {
      const duration = new Date().getTime() - start.getTime()
      const res = await fetch(`${SERVER_URL}/api/v1/dbquery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: apiKey,
        },
        body: JSON.stringify({
          apiKey: apiKey,
          duration: duration,
          path: `/api/v1/stream`
        }),
      });
      // console.log("THIS IS RESPONSE: ", res)
    })()
  ]);

  return new Response(stream);

  /* const stream = await OpenAIStream(payload);
  return new Response(stream); */
}
