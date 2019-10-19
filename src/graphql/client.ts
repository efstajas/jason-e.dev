import { createApolloFetch, FetchResult } from 'apollo-fetch';

const client = createApolloFetch({
  uri: 'https://api.jason-e.dev/graphql',
});

export default (
  query: string,
): Promise<FetchResult> => client({ query });
