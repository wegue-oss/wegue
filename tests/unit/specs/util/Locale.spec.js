import LocaleUtil from '@/util/Locale'
import Vue from 'vue';

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
    expect(typeof LocaleUtil).to.not.equal(undefined);
  });

  it('has the correct functions', () => {
    expect(typeof LocaleUtil.importLocales).to.equal('function');
    expect(typeof LocaleUtil.importVueI18nLocales).to.equal('function');
    expect(typeof LocaleUtil.importVuetifyLocales).to.equal('function');
    expect(typeof LocaleUtil.getPreferredLanguage).to.equal('function');
    expect(typeof LocaleUtil.getSupportedLanguages).to.equal('function');
    expect(typeof LocaleUtil.getFallbackLanguage).to.equal('function');
    expect(typeof LocaleUtil.isLanguageSupported).to.equal('function');
  });

  it('getSupportedLanguages returns correct languages', () => {
    const supported = LocaleUtil.getSupportedLanguages(appConfig);
    expect(supported).to.be.an('object');
    expect(Object.keys(supported).length).to.eql(4);
    expect(supported.en).to.eql('English');
    expect(supported.de).to.eql('Deutsch');
    expect(supported.pt).to.eql('Portugues');
    expect(supported.fr).to.eql('Français');
  });

  it('getSupportedLanguages returns correct fallback language when lang is unconfigured', () => {
    const supported = LocaleUtil.getSupportedLanguages({});
    expect(supported).to.be.an('object');
    expect(Object.keys(supported).length).to.eql(1);
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
