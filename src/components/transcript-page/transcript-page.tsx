import { Component, Prop, State } from '@stencil/core';
import { MatchResults, RouterHistory } from '@stencil/router';

import { get } from 'idb-keyval';


@Component({
  tag: 'transcript-page',
  styleUrl: 'transcript-page.css',
  shadow: true
})
export class TranscriptPage {

  @Prop() match: MatchResults;
  @Prop() history: RouterHistory;

  @State() transcript: any;

  async componentDidLoad() {
    console.log(this.match.params.id);

    const recordings = (await get('recordings') as any[]);

    const recording = recordings.find((element) => {
      if (element.id === this.match.params.id) {
        return element;
      }
    });

    console.log(recording);

    this.transcript = recording;
  }

  share() {
    if ((navigator as any).share) {
      (navigator as any).share({
        title: 'Notes',
        text: 'Check out this new note I took',
        url: location.href,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }
  }

  back() {
    this.history.goBack();
  }

  render() {
    return [
      <app-header>
        <div id='backButtonBlock'>
          <button onClick={() => this.back()} id='backButton'>
            <img src='/assets/back.svg'></img>
          </button>
        </div>
      </app-header>,

      <div id='wrapper'>
        <h2>{this.transcript ? this.transcript.title : 'loading...'}</h2>
        <p>Recorded on {this.transcript ? this.transcript.date : 'loading...'}</p>

        <audio controls src={this.transcript ? window.URL.createObjectURL(this.transcript.note) : null}></audio>

        <button onClick={() => this.share()} id='shareButton'>
          <img src='/assets/share.svg' alt='share button'></img>
        </button>
      </div>
    ];
  }
}
