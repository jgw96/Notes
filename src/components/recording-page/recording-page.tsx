import { Component, State, Prop } from '@stencil/core';
import { RouterHistory } from '@stencil/router';

import { set, get } from 'idb-keyval';

declare var MediaRecorder: any;

@Component({
  tag: 'recording-page',
  styleUrl: 'recording-page.css',
  shadow: true
})
export class RecordingPage {

  @Prop() history: RouterHistory;

  @State() transcript: string = 'waiting...';
  @State() recording: boolean = true;

  textInput: HTMLInputElement;
  stream: MediaStream;
  recorder: any;
  chunks: any[] = [];
  audioEl: HTMLAudioElement;
  audioBlob: Blob;

  async componentDidLoad() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log('getUserMedia supported.');
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
        });

        this.recorder = new MediaRecorder(this.stream);

        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => {
            this.recorder.start();
            this.recording = true;
          });
        }
        else {
          this.recorder.start();

          this.recording = true;
        }
      } catch (err) {
        console.error(err);
      }
    }

    this.handleEvents();
  }

  handleEvents() {
    this.recorder.ondataavailable = (e) => {
      this.chunks.push(e.data);
    };

    this.recorder.onstop = (e) => {
      this.recording = false;

      console.log(e);

      setTimeout(() => {
        this.audioBlob = new Blob(this.chunks, { 'type': 'audio/ogg; codecs=opus' });
        this.chunks = [];

        const url = window.URL.createObjectURL(this.audioBlob);
        console.log(url);
        this.audioEl.src = url;
      }, 300);

    }
  }

  stop() {
    this.recorder.stop();
  }

  async save() {
    console.log(this.textInput.value);
    const recordings = await get('recordings');

    const newRecording = {
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      title: this.textInput.value,
      note: this.audioBlob,
      date: new Intl.DateTimeFormat('en-US').format(new Date()),
    }

    if (recordings) {
      (recordings as any[]).push(newRecording);
      await set('recordings', recordings);

      this.history.goBack();
    } else {
      const newRecordings = [newRecording];
      await set('recordings', newRecordings);

      this.history.goBack();
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
        <input id='titleInput' type='text' ref={(el) => this.textInput = el as HTMLInputElement} placeholder='title...'></input>

        {!this.recording ? <div id='audioBlock'>
          <audio controls ref={(el) => this.audioEl = el as HTMLAudioElement}></audio>
        </div> : <h2 id='recordingText'>Recording...</h2>}

        {/*<div id='transcriptBlock'>
          <h3>Transcript</h3>
          <p id='transcript'>{this.transcript ? this.transcript : null}</p>
    </div>*/}

        {this.recording ?
          <button id='stopButton' onClick={() => this.stop()}>
            <img src='/assets/stop.svg' alt='stop button'></img>
          </button>
          :
          <button id='saveButton' onClick={() => this.save()}>
            <img src='/assets/save.svg' alt='save button'></img>
          </button>
        }
      </div>
    ];
  }
}
