export interface Root {
  stylesheet: any[]
  description: Description
  body: Body[]
  binary: Binary[]
}

export interface Description {
  "title-info": TitleInfo
  "document-info": DocumentInfo
  "publish-info": PublishInfo
  "custom-info": any[]
  output: any[]
}

export interface TitleInfo {
  genre: Genre[]
  author: Author[]
  "book-title": BookTitle
  lang: string
  translator: any[]
  sequence: any[]
}

export interface Genre {
  $text: string
}

export interface Author {
  "first-name": FirstName
  "last-name": LastName
  "home-page": any[]
  email: any[]
}

export interface FirstName {
  $text: string
}

export interface LastName {
  $text: string
}

export interface BookTitle {
  $text: string
}

export interface DocumentInfo {
  author: Author2[]
  "program-used": ProgramUsed
  date: Date
  "src-url": any[]
  id: string
  version: number
  publisher: any[]
}

export interface Author2 {
  "first-name": FirstName2
  "last-name": LastName2
  "home-page": any[]
  email: any[]
}

export interface FirstName2 {
  $text: string
}

export interface LastName2 {
  $text: string
}

export interface ProgramUsed {
  $text: string
}

export interface Date {
  $text: string
}

export interface PublishInfo {
  sequence: any[]
}

export interface Body {
  epigraph: any[]
  section: Section[]
}

export interface Section {
  epigraph: any[]
  $value: any[]
  section: any[]
}

export interface Book {
  "@id": string
  "@content-type": string
  $text: string
}
