import { NotificationPage } from './app.po';

describe('notification App', () => {
  let page: NotificationPage;

  beforeEach(() => {
    page = new NotificationPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
