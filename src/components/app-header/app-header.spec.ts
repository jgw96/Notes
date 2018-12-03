import { TestWindow } from '@stencil/core/testing';
import { AppHeader } from './app-header';

describe('app-header', () => {
  it('should build', () => {
    expect(new AppHeader()).toBeTruthy();
  });

  describe('rendering', () => {
    let element: HTMLAppHeaderElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [AppHeader],
        html: '<app-header></app-header>'
      });
    });

    // See https://stenciljs.com/docs/unit-testing
    {cursor}

  });
});
