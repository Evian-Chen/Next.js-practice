import os
import json
from openai import OpenAI
from dotenv import load_dotenv

# load in .env file
load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

if api_key is None:
    raise ValueError("API Key not found. Make sure OPENAI_API_KEY is set in your .env file.")

client = OpenAI(api_key=api_key)

print(api_key)

# intialize conversation
messages = [{
    "role": "system", 
    "content": "You are a helpful assistant."}]

# start conversation
while True:
    user_input = input("You (type exit to exit the conversation): ")
    if user_input == "exit":
        print("Conversation ends.")
        break

    messages.append({"role": "user", "content": user_input})

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        max_tokens=10
    )

    ai_reply = completion.choices[0].message.content
    messages.append({"role": "assistant", "content": ai_reply})
    
    print("ChatGPT: ", ai_reply)

# print(completion)

response_text = completion.choices[0].message.content

# saved as txt format
with open("response.txt", "w", encoding="utf-8") as file:
    file.write(response_text)
print("response saved to response.txt")

# saved as json format
response_data = {
    "model": "gpt-4o-mini",
    "response": completion.choices[0].message.content
}
with open("response.json", "w", encoding="utf-8") as file:
    json.dump(response_data, file, ensure_ascii=False, indent=4)
print("response saved to response.json")

print(completion)
print(messages)