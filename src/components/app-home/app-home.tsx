import { Component, State, Prop } from '@stencil/core';

import { get, set } from 'idb-keyval';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: true
})
export class AppHome {

  @State() recordings: any[];

  @Prop({ connect: 'ion-alert-controller' }) alertCtrl: any | null = null;

  async componentWillLoad() {
    const records = await get('recordings');

    if (records) {
      this.recordings = (records as any[]);
      console.log(this.recordings);
    }
  }

  async delete(recording: any, ev: Event) {
    ev.preventDefault();
    ev.stopPropagation()

    const alert = await this.alertCtrl.create({
      header: 'Delete note?',
      message: 'Are you sure you want to delete this note?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: async () => {
            await alert.dismiss();

            this.recordings.forEach(async (record) => {
              if (record.id === recording.id) {
                const index = this.recordings.indexOf(record);
                this.recordings.splice(index, 1);
              }
            })

            this.recordings = [...this.recordings];

            await set('recordings', this.recordings);
          }
        }
      ]
    });

    await alert.present();
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
                  <stencil-route-link url={`/notes/${recording.id}`}>
                    <li>
                      <div id="titleDiv">
                        <h4 id='listTitle'>{recording.title.length > 0 ? recording.title : 'no title'}</h4>
                        <p id='date'>{recording.date}</p>
                      </div>

                      <div>
                        <button onClick={(event) => this.delete(recording, event)} id="deleteButton">
                          <img src="/assets/remove.svg"></img>
                        </button>
                      </div>
                    </li>
                  </stencil-route-link>
                )
              })}
            </ul>
          </div>
          : null}

        <div id="actionButtonDiv">
          <stencil-route-link url='/recording'>
            <button id='startRecordingButton'>
              <img src='/assets/mic.svg'></img>
            </button>
          </stencil-route-link>
        </div>
      </div>
    ];
  }
}
