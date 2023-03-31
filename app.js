import createInterface from 'readline';
const readline = createInterface;
import { Configuration, OpenAIApi } from "openai";
import dotenv from 'dotenv';
dotenv.config();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

console.log("Quizbot");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.question('Quiz Theme: ', async (prompt) => {
    const quizCall = await ask("Make a 5 question quiz about " + prompt + ". Write Q: before the question, and do not write answers. And do not write anything else.");
    const rawQuestions = quizCall.replace(/\n/g, '').split('Q: ');
    rawQuestions.shift();
    answer(rawQuestions);
  }); 

async function answer(theQuestions){
    const responses = [];

    for (const question of theQuestions) {
      const response = await new Promise(resolve => {
        rl.question(question + " ", resolve);
      });
      responses.push(response);
    }
    const questionsJoined = theQuestions.join();
    const answersJoined = responses.join(" - ");
    const feedback = await ask("I will provide you with a set of five questions along with answers. Indicate what answer gains the user points. Correct=1 point. Incorrect=0 points. Make a table that looks nice in linux terminals 'Score'Question'Answer'Comment' Also, can you give a n/5 score at the end. This feedback goes directly to the user so be proffesional. The answers are separated with a '-'.\n"  + questionsJoined + "\n" + answersJoined);
    console.log(feedback);
    rl.close();
}

async function ask(prompt) {
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      });
    return completion.data.choices[0].message.content.trim();
}