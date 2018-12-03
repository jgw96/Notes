import { Component, State } from '@stencil/core';

import { get } from 'idb-keyval';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: true
})
export class AppHome {

  @State() recordings: any[];

  async componentWillLoad() {
    const records = await get('recordings');

    if (records) {
      this.recordings = (records as any[]);
      console.log(this.recordings);
    }
  }

  render() {
    return [
      <app-header></app-header>,

      <div class='app-home'>
        {!this.recordings ? <h2>Hit the button below to start!</h2> : null}

        {this.recordings ?
          <div>
            <ul>
              {this.recordings.map((recording) => {
                return (
                  <li>
                    <stencil-route-link url={`/notes/${recording.id}`}>
                      <h4 id='listTitle'>{recording.title.length > 0 ? recording.title : 'no title'}</h4>
                      <p id='date'>{recording.date}</p>
                    </stencil-route-link>
                  </li>
                )
              })}
            </ul>
          </div>
          : null}

        <stencil-route-link url='/recording'>
          <button id='startRecordingButton'>
            <img src='/assets/mic.svg'></img>
          </button>
        </stencil-route-link>
      </div>
    ];
  }
}
