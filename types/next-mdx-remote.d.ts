// types\next-mdx-remote.d.ts
declare module "next-mdx-remote" {
  import { ComponentType } from "react";

  export interface MDXRemoteSerializeResult {
    compiledSource: string;
    scope?: Record<string, unknown>;
  }

  export interface MDXRemoteProps {
    compiledSource: string;
    scope?: Record<string, unknown>;
    components?: Record<string, ComponentType>;
  }

  export const MDXRemote: ComponentType<MDXRemoteProps>;
}

declare module "next-mdx-remote/serialize" {
  import { MDXRemoteSerializeResult } from "next-mdx-remote";

  export function serialize(
    source: string,
    options?: {
      scope?: Record<string, unknown>;
      mdxOptions?: {
        remarkPlugins?: unknown[];
        rehypePlugins?: unknown[];
        format?: "mdx" | "md";
        outputFormat?: "function-body" | "program";
      };
    }
  ): Promise<MDXRemoteSerializeResult>;

  export type { MDXRemoteSerializeResult };
}
