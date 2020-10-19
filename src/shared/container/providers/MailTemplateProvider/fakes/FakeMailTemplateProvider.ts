import IMailTEmplateProvider from '../models/IMailTemplateProvider';

class FakeMailTemplateProvider implements IMailTEmplateProvider {
  public async parse(): Promise<string> {
    return 'Mail content';
  }
}

export default FakeMailTemplateProvider;
