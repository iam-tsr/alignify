console.time('gradio-gen');
import { Client } from "@gradio/client";

const client = await Client.connect("https://iam-tsr-alignify-gen.hf.space/");
const result = await client.predict("/generate_statements", { 
});

console.log(result.data);
console.timeEnd('gradio-gen');