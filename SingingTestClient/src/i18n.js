/* eslint-disable camelcase */
import Vue from 'vue';
import VueI18n from 'vue-i18n';

// i18n
import en from './i18n/en';
import zh_tw from './i18n/zh_tw';
import zh_cn from './i18n/zh_cn';

Vue.use(VueI18n);

function swtchLanguage() {
    const lang = window.localStorage.getItem('language');
    if (lang) {
        return lang;
    }
        return 'en';
}

const locale = swtchLanguage();

const messages = {
    en,
    zh_tw,
    zh_cn,
};

const i18n = new VueI18n({
    locale,
    messages,
    fallbackLocale: 'en',
    silentTranslationWarn: true,
});

export default i18n;
