import { Component, State } from '@stencil/core';

import { config } from '../../utils/config';
import { UserAgentApplication } from 'msal';
import { getUser, getProfilePhoto } from '../../utils/graph';


@Component({
  tag: 'app-header',
  styleUrl: 'app-header.css',
  shadow: true
})
export class AppHeader {

  userAgentApplication: any = new UserAgentApplication(config.appId, null, null);
  token: string;
  imageEl: HTMLImageElement;

  @State() user: any;
  @State() loggedIn: boolean = false;
  @State() profilePhoto: string;
  @State() openDrop: boolean;

  async componentDidLoad() {
    this.token = await this.userAgentApplication.acquireTokenSilent(config.scopes);
    console.log(this.token);
    if (this.token) {
      await this.getUserProfile();
    }
  }

  async login() {
    try {
      await this.userAgentApplication.loginPopup(config.scopes);
      await this.getUserProfile();
    }
    catch (err) {
      const errParts = err.split('|');
      console.log(errParts);
    }
  }

  async getUserProfile() {
    try {
      // Get the access token silently
      // If the cache contains a non-expired token, this function
      // will just return the cached token. Otherwise, it will
      // make a request to the Azure OAuth endpoint to get a token

      if (!this.token) {
        this.token = await this.userAgentApplication.acquireTokenSilent(config.scopes);
      }

      console.log(this.token);

      const userData = await getUser(this.token);
      console.log(userData);
      this.user = userData;

      const photoBinary = await getProfilePhoto(this.token);
      this.profilePhoto = window.URL.createObjectURL(photoBinary);

      this.loggedIn = true;
    }
    catch (err) {
      const errParts = err.split('|');
      console.log(errParts);
    }
  }

  render() {
    return [
      <header>
        <slot>
        </slot>

        <h1>Notes</h1>

        <div id='loginBlock'>
          {
            this.loggedIn ?
              <img id="userImage" onClick={() => this.openDrop = !this.openDrop} ref={(el) => this.imageEl = el as HTMLImageElement} alt='user photo' src={this.profilePhoto ? this.profilePhoto : null}></img>
              : <button onClick={() => this.login()}>
                <img src="/assets/login.svg" alt='login button image'></img>
              </button>
          }
        </div>

        {
          this.openDrop ? <div id='dropdown'><button>logout</button></div> : null
        }
      </header>
    ];
  }
}
