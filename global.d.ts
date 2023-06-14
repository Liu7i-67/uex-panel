declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.scss" {
  const css: { [key: string]: string };
  export default css;
}

declare module "*.gz";
declare module "workerize-loader!*" {
  function createInstance(): Worker;
  export = createInstance;
}
