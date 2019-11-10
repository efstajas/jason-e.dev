/* eslint-disable prefer-default-export */
export default (key: string, projects: {
  [key: string]: any,
}): string => {
  const keys = Object.keys(projects);
  const nextIndex = keys.indexOf(key) + 1;
  return keys[nextIndex];
};
