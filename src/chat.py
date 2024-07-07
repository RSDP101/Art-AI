from openai import OpenAI
client = OpenAI(
    api_key = "sk-proj-yCFxEwZo9PLIlwwfwPJBT3BlbkFJCu7lYhhXE4PTpGtUGNuX"

)

response = client.chat.completions.create(
  model="gpt-3.5-turbo-0125",
  response_format={ "type": "json_object" },
  messages=[
    {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
    {"role": "user", "content": "Who is the president of Brazil?"}
  ]
)
print(response.choices[0].message.content)
