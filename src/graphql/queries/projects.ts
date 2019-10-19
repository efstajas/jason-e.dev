import client from '@/graphql/client';

const query = `
query {
  projects {
    name
    date
    role
    subtitle
    tokens
    slug
  }
}`;

export default client(query);
