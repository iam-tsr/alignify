# import os
# from google import genai
# from google.genai import types
# from dotenv import load_dotenv

# load_dotenv()

# def generate():
#     client = genai.Client()
#     model = "gemini-2.5-flash"

#     num = 3 #Number of questions to generate
#     company_name = "TSR Corporation" #Company name
    
#     contents = [
#         types.Content(
#             role="user",
#             parts=[
#                 types.Part.from_text(text=f"""
#                 Generate short {num} multiple choice employee engagement questions. The questions should focus on employee, manager/team lead feedback, culture assessment, goal alignment for the company named {company_name}."""),
#             ],
#         ),
#     ]

#     generate_content_config = types.GenerateContentConfig(
#         response_mime_type="application/json",
#         response_schema=genai.types.Schema(
#             type = genai.types.Type.OBJECT,
#             properties = {
#                 "questions": genai.types.Schema(
#                     type = genai.types.Type.ARRAY,
#                     items = genai.types.Schema(
#                         type = genai.types.Type.STRING,
#                     ),
#                 ),
#             },
#         ),
#     )

#     response_text = ""
#     for chunk in client.models.generate_content_stream(
#         model=model,
#         contents=contents,
#         config=generate_content_config,
#     ):
#         response_text += chunk.text
#     resp = eval(response_text)

#     questions = []

#     for _ in resp['questions']:
#         questions.append(_)

#     return questions