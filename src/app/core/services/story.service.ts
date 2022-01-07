import { Injectable } from '@angular/core';
import { Story } from '@app/shared/models';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Story_API } from '@core/helpers';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  storyApi: string = Story_API + 'epics';
  constructor(private http: HttpClient) { }

  getStoriesByEpicId(epicId: string) {
    return this.http.get(this.storyApi + '/' + epicId + '/stories/list').pipe(
      map(res => {
        let stories = res as Story[];
        stories.map(story => story.numberOfTestScripts = 12);
        return stories;
      })
    );
  }

  addStory(story: Story) {
    story.organizationId = localStorage.getItem('organizationId');
    story.projectId = localStorage.getItem('projectId');
    return this.http.post(this.storyApi + '/' + story.epicId + '/stories', story).pipe();
  }

  updateStory(story: Story) {
    return this.http.put(this.storyApi + '/' + story.epicId + '/stories/' + story.storyId, story).pipe();
  }

  removeStoryById(epicId: string, storyId: string) {
    return this.http.delete(this.storyApi + '/' + epicId + '/stories/' + storyId).pipe();
  }
}
