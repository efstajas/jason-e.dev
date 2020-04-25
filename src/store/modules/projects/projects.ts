/*
ATTENTION
This file is a bit insane. I've tried abstracting the logic too much
and ended up with a comically convoluted system for fetching projects.

TODO: Rewrite this whole thing and make it less crazy.
*/

import {
  Module,
  Mutation,
  VuexModule,
  Action,
} from 'vuex-module-decorators';

import fetchProjects from '@/graphql/queries/project';
import {
  arraysMatch,
  generateArrayOfProductsToExclude,
} from './util';
import { Context } from '@/graphql/fieldsFor/project/contexts';
import ListingFields from '@/graphql/fieldsFor/project/listing';
import ViewFields from '@/graphql/fieldsFor/project/view';

type Project = any;

@Module({
  name: 'Projects',
})
export default class extends VuexModule {
  fetchedProjects: {
    [slug: string]: Project,
  } = {};

  lastFetchedAllProjects: Date | null = null;

  get getProject() {
    return (slug: string) => this.fetchedProjects[slug];
  }

  get getAllProjects() {
    return this.fetchedProjects;
  }

  get getLastFetchedAllProjects() {
    return this.lastFetchedAllProjects;
  }

  @Mutation
  appendProjects(input: {
    projects: Project[],
    context: Context,
  }): void {
    input.projects.forEach((project: Project) => {
      this.fetchedProjects[project.slug] = this.fetchedProjects[project.slug]
        ? {
          ...this.fetchedProjects[project.slug],
          ...project,
          fetchContext: input.context,
        }
        : {
          ...project,
          fetchContext: input.context,
        };
    });
  }

  @Mutation
  removeProject(project: Project): void {
    const projects = this.fetchedProjects;
    delete projects[project.slug];
    this.fetchedProjects = projects;
  }

  @Mutation
  setLastFetchedAllProjects(date: Date): void {
    this.lastFetchedAllProjects = date;
  }

  @Action
  async getProjectsForContext(options: {
    context: Context,
    projects: string[] | 'all',
    except?: string[],
    sort?: string,
    after?: string,
    first?: number,
    includeExisting?: boolean,
  } = {
    context: 'Listing',
    projects: 'all',
  }): Promise<void> {
    if (this.getLastFetchedAllProjects && options.projects === 'all') return;

    this.context.dispatch('setLoading', true, { root: true });

    let fields = [];

    switch (options.context) {
      case 'Listing':
        fields = ListingFields;
        break;
      case 'View':
        fields = ViewFields;
        break;
      default:
        throw new Error('unknown project fetch context');
    }

    const projectsToExclude: string[] = (options.except) || [];

    if (options.projects === 'all') {
      projectsToExclude.concat(generateArrayOfProductsToExclude(
        options.context,
        Object.keys(this.getAllProjects),
        this.getAllProjects,
      ));
    } else if (options.projects instanceof Array) {
      projectsToExclude.concat(generateArrayOfProductsToExclude(
        options.context,
        options.projects,
        this.getAllProjects,
      ));

      if (options.first && projectsToExclude.length >= options.first) return;
      if (arraysMatch(options.projects, projectsToExclude)) return;
    }

    const urlParams = new URLSearchParams(window.location.search);

    const query = `
      ${options.projects === 'all' ? '' : `slug_in: ${JSON.stringify(options.projects)}`}
      slug_nin: ${JSON.stringify(projectsToExclude)}
      ${urlParams.get('drafts') === 'yes' ? 'status: "draft"' : ''}
    `;

    const { projects } = (await fetchProjects({
      fields: fields.join('\n'),
      where: query,
      sort: options.sort,
      first: options.first,
      after: options.after,
    })).data;

    this.context.commit('appendProjects', {
      projects,
      context: options.context,
    });
    if (options.projects === 'all') this.context.commit('setLastFetchedAllProjects', new Date());

    this.context.dispatch('setLoading', false, { root: true });
  }

  @Action
  removeProjects(projects: Project[] | Project): void {
    if (projects.isArray) {
      projects.forEach((project: Project) => {
        this.context.commit('removeProject', project);
      });
    } else {
      this.context.commit('removeProject', projects);
    }
  }
}
