from gradio_client import Client

def generate():
	client = Client("https://iam-tsr-alignify-gen.hf.space/")
	result = client.predict(
		api_name="/generate_statements"
	)
	return result # 9sec response time

if __name__ == "__main__":
	print(generate())