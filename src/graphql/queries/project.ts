import client from '@/graphql/client';

const queryString = (
  fields: string,
  where?: string,
  sort?: string,
  first?: number,
  after?: string,
  start?: number,
) => `
  query {
    projects(
      ${where ? `where: {${where}}` : ''}
      ${sort ? `sort: "${sort}"` : ''}
      ${first ? `limit: ${first}` : ''}
      ${after ? `after: "${after}"` : ''}
      ${start ? `start: ${start}` : ''}
    ) {${fields}}
  }
`;

export default (
  options: {
    fields: string,
    where?: string,
    sort?: string,
    first?: number,
    after?: string,
    start?: number,
  },
) => client(queryString(
  options.fields,
  options.where,
  options.sort,
  options.first,
  options.after,
  options.start,
));
