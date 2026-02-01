import requests
import json
from dotenv import load_dotenv
import os

load_dotenv()

# huggingface token
HF_TOKEN = os.getenv("HF_TOKEN")
# The URL from your curl command
URL = "https://iam-tsr-alignify-classify.hf.space/gradio_api/call/predict"

headers = {
    "Authorization": f"Bearer {HF_TOKEN}",
    "Content-Type": "application/json"
}

def classifier(input_text):

    payload = {"data": [input_text]}
    resp = requests.post(URL, headers=headers, json=payload)
    event_data = resp.json()
    event_id = event_data['event_id']

    result_url = f"{URL}/{event_id}"
    with requests.get(result_url, headers=headers, stream=False) as stream_resp:
        for line in stream_resp.iter_lines():
            if line:
                decoded = line.decode('utf-8')
                
                if decoded.startswith("data:"):
                    json_data = json.loads(decoded.replace("data: ", ""))
                    return json_data[0]

# Execute
if __name__ == "__main__": # Response time 2sec
    input = "I hate my boss"
    result = classifier(input)
    print(input, ":", result)