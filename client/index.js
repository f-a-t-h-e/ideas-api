const { faker } = require("@faker-js/faker");
const axios = require("axios");

const IDIEA_GENERATOR = "https://appideagenerator.com/call.php?";
const IDEA_API = "http://localhost:3000/api/v1";

const randInt = (num = 10) => Math.floor(Math.random() * num);

class Client {
  generateIdea = async () => {
    const { data } = await axios.get(IDIEA_GENERATOR);
    return data.replace(/\n/g, "");
  };

  generateUser = async () => {
    const {
      data,
      headers: { "set-cookie": cookies },
    } = await axios.post(`${IDEA_API}/../../auth/register`, {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: "password",
    });

    return { data, cookies };
  };

  postNewIdea = async (cookie) => {
    const idea = faker.random.words(randInt(5) + 1);
    const { data } = await axios.post(
      `${IDEA_API}/ideas`,
      {
        idea,
        description: faker.lorem.paragraph(),
      },
      { headers: { Cookie: cookie } }
    );
    return data;
  };

  postNewComment = async ({ cookies, idea }) => {
    const comment = faker.random.words(randInt(5) + 1);
    const { data } = await axios.post(
      `${IDEA_API}/ideas/${idea.id}/comment`,
      {
        content: comment,
      },
      { headers: { Cookie: cookies } }
    );
    return data;
  };

  moreUsers = async (num) => {
    const cookies = [];
    const users = [];
    for (let i = 0; i < num; i++) {
      const { data: user, cookies: cookie } = await this.generateUser();
      cookies.push(cookie);
      users.push(user);
    }
    return { users, cookies };
  };

  moreIdeas = async ({ cookies, num }) => {
    const ideas = [];
    for (let i = 0; i < num; i++) {
      const idea = await this.postNewIdea(cookies);
      ideas.push(idea);
    }
    return ideas;
  };

  moreComments = async ({ cookies, idea, num }) => {
    const comments = [];
    for (let i = 0; i < num; i++) {
      const comment = await this.postNewComment({ cookies, idea });
      comments.push(comment);
    }
    return comments;
  };
}

// Main function

const bootstrap = async () => {
  const client = new Client();

  const ideas = [];
  const comments = [];
  const { users, cookies } = await client.moreUsers(randInt());

  for (let i = 0; i < users.length; i++) {
    const cookie = cookies[i];
    ideas.push(await client.moreIdeas({ cookies: cookie, num: randInt() }));
  }

  const theIdeas = ideas.flat(1);
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    for (let j = 0; j < theIdeas.length; j++) {
      const idea = theIdeas[j];
      comments.push(
        await client.moreComments({ cookies: cookie, idea, num: randInt() })
      );
    }
  }

  const theComments = comments.flat(1);

  console.log("---USERS---");
  console.log(users.length);
  console.log("---Ideas---");
  console.log(theIdeas.length);
  console.log("---COMMENTS---");
  console.log(theComments.length);
};

bootstrap();
