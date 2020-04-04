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
      friendIds: ['2', '3'],
      postIds: ['1'],
      transportationId: { type: 'bike', id: '1' },
      hobbyIds: [
        { type: 'culinaryHobby', id: '1' },
        { type: 'culinaryHobby', id: '2' },
        { type: 'sportsHobby', id: '1' },
      ],
      favoriteColor: 'Yellow',
      leastFavoriteColor: 'Blue',
    },
    {
      id: '2',
      name: 'Barney Rubble',
      age: 40,
      friendIds: ['1'],
      transportationId: { type: 'publicTransit', id: '3' },
      hobbyIds: [
        { type: 'makerHobby', id: '1' },
        { type: 'sportsHobby', id: '2' },
      ],
      favoriteColor: 'Green',
    },
    {
      id: '3',
      name: 'Wilma Flinstone',
      age: 40,
      friendIds: ['1'],
      transportationId: { type: 'publicTransit', id: '3' },
      hobbyIds: [{ type: 'makerHobby', id: '1' }],
      favoriteColor: 'Red',
    },
  ],
  bikes: [
    {
      id: '1',
      brand: 'Bianchi',
    },
    {
      id: '2',
      brand: 'Cannondale',
    },
  ],
  publicTransits: [
    {
      id: '1',
      primary: 'Bus',
    },
    {
      id: '2',
      primary: 'Tram',
    },
    {
      id: '3',
      primary: 'Subway',
    },
  ],
  cars: [
    {
      id: '1',
      make: 'Tesla',
      model: 'Model 3',
    },
    {
      id: '2',
      make: 'Honda',
      model: 'Civic',
    },
    {
      id: '3',
      make: 'Volkwagen',
      model: 'Golf',
    },
  ],
  culinaryHobbies: [
    {
      id: '1',
      name: 'Cooking',
      requiresEquipment: true,
      requiresOven: false,
      requiresStove: true,
    },
    {
      id: '2',
      name: 'Baking',
      requiresEquipment: true,
      requiresOven: true,
      requiresStove: false,
    },
  ],
  sportsHobbies: [
    {
      id: '1',
      name: 'Running',
      requiresEquipment: false,
      hasMultiplePlayers: false,
    },
    {
      id: '2',
      name: 'Soccer',
      requiresEquipment: true,
      hasMultiplePlayers: true,
    },
  ],
  makerHobbies: [
    {
      id: '1',
      name: 'Knitting',
      requiresEquipment: true,
      makerType: 'Textile',
    },
    {
      id: '2',
      name: 'Arduino',
      requiresEquipment: true,
      makerType: 'Electronic',
    },
  ],
};
