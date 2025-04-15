export interface SectionContent {
  [key: string]: {
    $value: string[];
  };
}

export type InlineContent = string | TagElement | TagValue;

export interface TagElement {
  [tagName: string]: TagValue[];
}

export interface TagValue {
  href?: string;
  $value: InlineContent[];
}
