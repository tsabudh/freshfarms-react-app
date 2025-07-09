declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
declare module '*.png' {
  const value: string;
  export default value;
}