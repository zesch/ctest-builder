import { CTestBuilderPage } from './app.po';

describe('c-test-builder App', () => {
  let page: CTestBuilderPage;

  beforeEach(() => {
    page = new CTestBuilderPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
