import { D3DTSPage } from './app.po';

describe('d3-dts App', () => {
  let page: D3DTSPage;

  beforeEach(() => {
    page = new D3DTSPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('d3d works!');
  });
});
