import {
  Module,
  Mutation,
  VuexModule,
  Action,
} from 'vuex-module-decorators';
import fetchProjects from '@/graphql/queries/project';

type Project = any;

@Module({
  name: 'Projects',
})
export default class extends VuexModule {
  fetchedProjects: {
    [slug: string]: Project,
  } = {};

  get getProject() {
    return (slug: string) => this.fetchedProjects[slug];
  }

  get getAllProjects() {
    return this.fetchedProjects;
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

  @Action
  async fetchProjects(options: {
    query: string,
    fields: string,
  }): Promise<void> {
    const projects = await fetchProjects(options.query, options.fields);
    this.context.commit('appendProjects', projects.data.projects);
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
