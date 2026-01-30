from gradio_client import Client

def classify_text(text):
    client = Client("iam-tsr/alignify-classify")
    result = client.predict(
        text=text,
        api_name="/predict"
    )
    return result # 5sec response time

if __name__ == "__main__":
    sample_text = "I don't like my job and my boss is terrible."
    print(classify_text(sample_text))