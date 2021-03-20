import { createApolloFetch, FetchResult } from 'apollo-fetch';

const client = createApolloFetch({
  uri: 'https://strapi-personal-web.herokuapp.com/graphql',
});

export default (
  query: string,
): Promise<FetchResult> => client({ query });
