import IParseMailTEmplateDTO from '../dtos/IParseMailTemplateDTO';

export default interface IMailTemplateProvider {
  parse(data: IParseMailTEmplateDTO): Promise<string>;
}
