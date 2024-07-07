import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: 'sk-proj-yCFxEwZo9PLIlwwfwPJBT3BlbkFJCu7lYhhXE4PTpGtUGNuX',
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "What is the amount of people in the US today?" }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0].message.content);
}

main();