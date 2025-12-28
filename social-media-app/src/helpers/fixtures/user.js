import { faker } from "@faker-js/faker";

function userFixtures() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    // Используем встроенный генератор UUID из Faker
    id: faker.string.uuid(),
    first_name: firstName,
    last_name: lastName,
    name: `${firstName} ${lastName}`,
    post_count: faker.number.int({ min: 0, max: 20 }), // Более читаемо, чем Math.random

    // Безопасная генерация на основе имени
    email: faker.internet.email({ firstName, lastName, provider: 'yopmail.com' }),
    username: `${firstName}.${lastName}.${faker.string.alphanumeric(5)}`.toLowerCase(),

    bio: faker.lorem.sentence(10), // 20 слов для био может быть многовато
    avatar: null,

    // Сериализация даты в ISO строку (как обычно делает Django REST Framework)
    created: faker.date.recent().toISOString(),
    updated: faker.date.recent().toISOString(),
  };
}

export default userFixtures;
