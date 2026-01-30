console.time('gradio-gen');
import { Client } from "@gradio/client";
	
	const client = await Client.connect("iam-tsr/alignify-classify");
	const result = await client.predict("/predict", { 		
			text: "I have my boss", 
						
	});

	console.log(result.data);
console.timeEnd('gradio-gen');