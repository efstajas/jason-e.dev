import client from '@/graphql/client';

export default async () => (await client(`
  query {
    abouts(
      where: {
        id: 1
      }
    ) {
      content
    }
  }
`)).data.abouts[0];
