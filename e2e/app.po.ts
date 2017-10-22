import { browser, element, by } from 'protractor';

export class D3DTSPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('d3d-root h1')).getText();
  }
}
