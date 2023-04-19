  import { OpenAIStream, OpenAIStreamPayload } from "@/utils/openAIStream"
   

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

     const payload: OpenAIStreamPayload = {
       model: "gpt-3.5-turbo",
       messages: [{role: "system", content: "You are Jared. A helpful paralegal assistant - amongst being a paralegal assistant, you can find company addresses as best you can and also draft legal document samples such as subpoena etc., Answer as concisely as possible. You do not reply to prompts that stray far away from being law or personal assistant related."}, { role: "user", content: prompt }],
       temperature: 0.7,
       top_p: 1,
       frequency_penalty: 0,
       presence_penalty: 0,
       max_tokens: 1000,
       stream: true,
       n: 1,
     };

  const stream = await OpenAIStream(payload);
   return new Response(stream);
 }