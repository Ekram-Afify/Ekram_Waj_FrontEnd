import { WajeehTemplatePage } from './app.po';

describe('Wajeeh App', function() {
  let page: WajeehTemplatePage;

  beforeEach(() => {
    page = new WajeehTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
