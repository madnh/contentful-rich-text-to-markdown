export interface Asset {
  sys: Sys;
  fields: {
    title: string;
    description: string;
    file: {
      url: string;
      details: {
        size: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
  metadata: Metadata;
}

export interface ContentfulCollection<T> {
  total: number;
  skip: number;
  limit: number;
  items: Array<T>;
}

export interface Entry<T, ContentTypeID = string> {
  sys: Sys<ContentTypeID>;
  fields: T;
  metadata: Metadata;
}

export interface Space {
  sys: Sys;
  name: string;
  locales: Array<string>;
}

export interface Sys<ContentTypeID = string> {
  type: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  locale: string;
  revision?: number;
  space?: {
    sys: SpaceLink;
  };
  contentType: {
    sys: ContentTypeLink<ContentTypeID>;
  };
}

export interface SpaceLink {
  type: 'Link';
  linkType: 'Space';
  id: string;
}

export interface ContentTypeLink<ID = string> {
  type: 'Link';
  linkType: 'ContentType';
  id: ID;
}

/**
 * Types of fields found in an Entry
 */
export namespace EntryFields {
  export type Symbol = string;
  export type Text = string;
  export type Integer = number;
  export type Number = number;
  export type Date = string;
  export type Boolean = boolean;

  export interface Location {
    lat: string;
    lon: string;
  }

  export type Link<T> = Asset | Entry<T>;
  export type Array<T = any> = Symbol[] | Entry<T>[] | Asset[];
  export type Object<T = any> = T;

  export interface RichText {
    data: {};
    content: RichTextContent[];
    nodeType: 'document';
  }
}

export interface RichTextDataTarget {
  sys: {
    id: string;
    type: 'Link';
    'linkType': 'Entry' | 'Asset';
  };
}

export interface RichTextData {
  uri?: string;
  target?: RichTextDataTarget;
}

export type RichTextNodeType = 'text' | 'heading-1' | 'heading-2' | 'heading-3' | 'heading-4' | 'heading-5'
  | 'heading-6' | 'paragraph' | 'hyperlink' | 'entry-hyperlink' | 'asset-hyperlink'
  | 'unordered-list' | 'ordered-list' | 'list-item' | 'blockquote' | 'hr' | 'embedded-entry-block'
  | 'embedded-entry-inline';

export interface RichTextContent {
  data: RichTextData;
  content?: RichTextContent[]
  marks: { type: ('bold' | 'underline' | 'code' | 'italic') }[];
  value?: string;
  nodeType: RichTextNodeType;
}

export interface TagLink {
  sys: {
    type: 'Link';
    linkType: 'Tag';
    id: string;
  }
}

export interface Metadata {
  tags: TagLink[];
}
