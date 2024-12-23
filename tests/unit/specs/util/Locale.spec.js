import LocaleUtil from '@/util/Locale';

const appConfig = {
  lang: {
    supported: {
      en: 'English',
      de: 'Deutsch',
      pt: 'Portugues',
      fr: 'Français'
    },
    fallback: 'de'
  }
};

describe('LocaleUtil', () => {
  it('is defined', () => {
    expect(LocaleUtil).to.not.be.an('undefined');
  });

  it('has the correct functions', () => {
    expect(LocaleUtil.importLocales).to.be.a('function');
    expect(LocaleUtil.importVueI18nLocales).to.be.a('function');
    expect(LocaleUtil.importVuetifyLocales).to.be.a('function');
    expect(LocaleUtil.getPreferredLanguage).to.be.a('function');
    expect(LocaleUtil.getSupportedLanguages).to.be.a('function');
    expect(LocaleUtil.getFallbackLanguage).to.be.a('function');
    expect(LocaleUtil.isLanguageSupported).to.be.a('function');
  });

  it('getSupportedLanguages returns correct languages', () => {
    const supported = LocaleUtil.getSupportedLanguages(appConfig);

    expect(supported).to.be.an('object');
    expect(Object.keys(supported)).to.have.lengthOf(4);
    expect(supported.en).to.eql('English');
    expect(supported.de).to.eql('Deutsch');
    expect(supported.pt).to.eql('Portugues');
    expect(supported.fr).to.eql('Français');
  });

  it('getSupportedLanguages returns correct fallback language when lang is unconfigured', () => {
    const supported = LocaleUtil.getSupportedLanguages({});

    expect(supported).to.be.an('object');
    expect(Object.keys(supported)).to.have.lengthOf(1);
    expect(supported.en).to.eql('English');
  });

  it('getFallbackLanguage returns correct language', () => {
    const fallback = LocaleUtil.getFallbackLanguage(appConfig);

    expect(fallback).to.eql('de');
  });

  it('getFallbackLanguage returns correct language when lang is unconfigured', () => {
    const fallback = LocaleUtil.getFallbackLanguage({});

    expect(fallback).to.eql('en');
  });

  it('isLanguageSupported returns correct results', () => {
    const enSupported = LocaleUtil.isLanguageSupported('en', appConfig);
    const deSupported = LocaleUtil.isLanguageSupported('de', appConfig);
    const nlSupported = LocaleUtil.isLanguageSupported('nl', appConfig);
    const ptSupported = LocaleUtil.isLanguageSupported('pt', appConfig);
    const frSupported = LocaleUtil.isLanguageSupported('fr', appConfig);

    expect(enSupported).to.be.true;
    expect(deSupported).to.be.true;
    expect(nlSupported).to.be.false;
    expect(ptSupported).to.be.true;
    expect(frSupported).to.be.true;
  });

  it('isLanguageSupported returns correct results when lang is unconfigured', () => {
    const enSupported = LocaleUtil.isLanguageSupported('en', {});
    const deSupported = LocaleUtil.isLanguageSupported('de', {});
    const frSupported = LocaleUtil.isLanguageSupported('fr', {});

    expect(enSupported).to.be.true;
    expect(deSupported).to.be.false;
    expect(frSupported).to.be.false;
  });
});
