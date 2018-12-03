import { TestWindow } from '@stencil/core/testing';
import { TranscriptPage } from './transcript-page';

describe('transcript-page', () => {
  it('should build', () => {
    expect(new TranscriptPage()).toBeTruthy();
  });

  describe('rendering', () => {
    let element: HTMLTranscriptPageElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [TranscriptPage],
        html: '<transcript-page></transcript-page>'
      });
    });

    // See https://stenciljs.com/docs/unit-testing
    {cursor}

  });
});
