import client from '@/graphql/client';

const queryString = (
  where: string,
  fields: string,
  sort?: string,
) => {
  console.log(sort);
  return `
  query {
    projects(
      ${where ? `where: {${where}}` : ''}
      ${sort ? `sort: "${sort}"` : ''}
    ) {${fields}}
  }`;
};

export default (
  query: string,
  fields: string,
  sort?: string,
) => client(queryString(query, fields, sort));
