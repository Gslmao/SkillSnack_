/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/lesson-details`; params?: Router.UnknownInputParams; } | { pathname: `/lesson`; params?: Router.UnknownInputParams; } | { pathname: `/login`; params?: Router.UnknownInputParams; } | { pathname: `/quiz-screen`; params?: Router.UnknownInputParams; } | { pathname: `/topic`; params?: Router.UnknownInputParams; } | { pathname: `/../data/lessonContent`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/lesson-details`; params?: Router.UnknownOutputParams; } | { pathname: `/lesson`; params?: Router.UnknownOutputParams; } | { pathname: `/login`; params?: Router.UnknownOutputParams; } | { pathname: `/quiz-screen`; params?: Router.UnknownOutputParams; } | { pathname: `/topic`; params?: Router.UnknownOutputParams; } | { pathname: `/../data/lessonContent`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/lesson-details${`?${string}` | `#${string}` | ''}` | `/lesson${`?${string}` | `#${string}` | ''}` | `/login${`?${string}` | `#${string}` | ''}` | `/quiz-screen${`?${string}` | `#${string}` | ''}` | `/topic${`?${string}` | `#${string}` | ''}` | `/../data/lessonContent${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/lesson-details`; params?: Router.UnknownInputParams; } | { pathname: `/lesson`; params?: Router.UnknownInputParams; } | { pathname: `/login`; params?: Router.UnknownInputParams; } | { pathname: `/quiz-screen`; params?: Router.UnknownInputParams; } | { pathname: `/topic`; params?: Router.UnknownInputParams; } | { pathname: `/../data/lessonContent`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
    }
  }
}
