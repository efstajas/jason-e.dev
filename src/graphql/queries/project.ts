import client from '@/graphql/client';


const queryString = (where: string, fields: string) => `
query {
  projects(
    where: {${where}}
  ) {${fields}}
}`;

export default (query: string, fields: string) => client(queryString(query, fields));
