import { Project } from '@/graphql/fieldsFor/project/fields';

// get next project slug
export default (key: string, projects: {
  [key: string]: any,
}): string => {
  const keys = Object.keys(projects);
  const nextIndex = keys.indexOf(key) + 1;
  return keys[nextIndex] || keys[0];
};

export const sortProjectsByDate = (input: any): {
  [key: string]: Project,
} => {
  const sorted: {
    [key: string]: Project,
  } = {};

  Object
    .keys(input)
    .sort((a, b) => input[b].date - input[a].date)
    .forEach((key) => {
      sorted[key] = input[key];
    });

  return sorted;
};
