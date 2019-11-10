import {
  Module,
  Mutation,
  VuexModule,
  Action,
} from 'vuex-module-decorators';

import fetchProjects from '@/graphql/queries/project';

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
  appendProjects(projects: Project[]): void {
    projects.forEach((project: Project) => {
      this.fetchedProjects[project.slug] = this.fetchedProjects[project.slug]
        ? {
          ...this.fetchedProjects[project.slug],
          ...project,
        }
        : project;
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
    query?: string,
    sort?: string,
    after?: string,
    first?: number
  }): Promise<void> {
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

    const projects = await fetchProjects({
      fields: fields.join('\n'),
      where: options.query,
      sort: options.sort,
      first: options.first,
      after: options.after,
    });
    this.context.commit('appendProjects', projects.data.projects);
    if (options.query === '') this.context.commit('setLastFetchedAllProjects', new Date());
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
