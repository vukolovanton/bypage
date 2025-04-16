export interface SectionContent {
  [key: string]: {
    $value: MixedConrent[];
  };
}

export type MixedConrent = string | TagElement;

export type InlineContent = string | TagElement | TagValue;

export interface TagElement {
  [tagName: string]: TagValue[];
}

export interface TagValue {
  href?: string;
  $value: string[];
}
