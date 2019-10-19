import client from '@/graphql/client';


const query = (slug: string) => `
query {
  projects(
    where: {
      slug: "${slug}"
    }
  ) {
    name
    date
    role
    subtitle
    tokens
    content
  }
}`;

export default (slug: string) => client(query(slug));
