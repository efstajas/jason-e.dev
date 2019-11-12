import { Project } from '@/graphql/fieldsFor/project/fields';
import { Context } from '@/graphql/fieldsFor/project/contexts';
import ProjectContextHierarchy from '@/graphql/fieldsFor/project/hierarchy';

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

export const allRequiredFieldsPresent = (
  context: Context,
  project: any,
): boolean => (
  project
  && (
    ProjectContextHierarchy.indexOf(context)
    <= ProjectContextHierarchy.indexOf(project.fetchContext)
  )
);

export const generateArrayOfProductsToExclude = (
  context: Context,
  projectsToCheck: string[],
  projects: {
    [slug: string]: any,
  },
): string[] => {
  const result: string[] = [];

  projectsToCheck.forEach((slug) => {
    if (allRequiredFieldsPresent(
      context,
      projects[slug],
    )) result.push(slug);
  });

  return result;
};

export const arraysMatch = (a: any[], b: any[]) => a.join('') === b.join('');
