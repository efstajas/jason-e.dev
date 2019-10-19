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
    slug
  }
}`;

export default (slug: string) => client(query(slug));
