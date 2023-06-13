import 'react-i18next';
declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      [key: string]: IObj;
    };
  }
}

interface IObj {
  [key: string]: string;
}
