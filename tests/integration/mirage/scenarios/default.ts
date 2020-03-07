export default {
  comments: [
    {
      id: '1',
      body: 'I love the town of Bedrock!',
      authorId: '2',
    },
  ],
  posts: [
    {
      id: '1',
      title: 'Meet the Flintstones!',
      body: "They're the modern stone age family. From the town of Bedrock. They're a page right out of history",
      authorId: '1',
      commentIds: ['1'],
    },
  ],
  people: [
    {
      id: '1',
      name: 'Fred Flinstone',
      age: 43,
      friendIds: ['2'],
      postIds: ['1'],
    },
    {
      id: '2',
      name: 'Barney Rubble',
      age: 40,
      friendIds: ['1'],
    },
  ],
};
