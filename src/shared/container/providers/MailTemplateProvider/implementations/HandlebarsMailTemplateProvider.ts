import handlebars from 'handlebars';
import fs from 'fs';

import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';
import IMailTEmplateProvider from '../models/IMailTemplateProvider';

class HandlebarsMailTemplateProvider implements IMailTEmplateProvider {
  public async parse({
    file,
    variables,
  }: IParseMailTemplateDTO): Promise<string> {
    const templateContent = await fs.promises.readFile(file, {
      encoding: 'utf8',
    });
    const parseTemplat = handlebars.compile(templateContent);

    return parseTemplat(variables);
  }
}

export default HandlebarsMailTemplateProvider;
