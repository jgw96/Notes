import { TestWindow } from '@stencil/core/testing';
import { RecordingPage } from './recording-page';

describe('recording-page', () => {
  it('should build', () => {
    expect(new RecordingPage()).toBeTruthy();
  });

  describe('rendering', () => {
    let element: HTMLRecordingPageElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [RecordingPage],
        html: '<recording-page></recording-page>'
      });
    });

    // See https://stenciljs.com/docs/unit-testing
    {cursor}

  });
});
