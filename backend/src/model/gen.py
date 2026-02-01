import requests
import json
from dotenv import load_dotenv
import os

load_dotenv()

# huggingface token
HF_TOKEN = os.getenv("HF_TOKEN")
# The URL from your curl command
URL = "https://iam-tsr-alignify-gen.hf.space/gradio_api/call/generate_statements"

headers = {
    "Authorization": f"Bearer {HF_TOKEN}",
    "Content-Type": "application/json"
}

def parse_data(data):
    if isinstance(data, list):
        data = data[0]
    data = data.strip().strip('"').strip("'")
    data = data.strip('[').strip(']')
    
    items = data.split("', '")
    
    if items:
        items[0] = items[0].lstrip("'")
        items[-1] = items[-1].rstrip("'")
    
    items = '[' + ', '.join(f'"{item}"' for item in items) + ']'
    return items

def hf_space_gen():
    payload = {"data": []}
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
                    return json_data

def generate():
    result = hf_space_gen()
    result = parse_data(result)
    return result

# Execute
if __name__ == "__main__": # Response time 8sec
    print(generate())