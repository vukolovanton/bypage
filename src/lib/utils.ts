import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const LOREM_IPSUM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque aliquet ipsum nisl, hendrerit placerat neque vulputate ut. Fusce eget dolor et metus sodales finibus nec faucibus nunc. Ut a ligula volutpat, condimentum libero vel, aliquam turpis. Curabitur id luctus elit, hendrerit dapibus dolor. Ut augue diam, ultrices id metus at, finibus sollicitudin est. Praesent molestie enim quis odio pretium aliquam. Cras sollicitudin euismod purus in efficitur. Duis sollicitudin varius enim sit amet dapibus. Pellentesque ante risus, bibendum laoreet pretium quis, varius sed diam. Nam hendrerit urna erat, id iaculis tortor mattis quis. Nam orci augue, sodales at mi congue, pharetra convallis orci. Vivamus dapibus, enim non gravida pulvinar, neque mi consequat erat, ac lobortis dolor massa in urna. Ut feugiat, enim non semper varius, est nisi dictum nunc, ac feugiat mi sem nec felis. Ut et libero quis sapien volutpat fermentum. Sed nec porttitor diam, non tempor lacus. Vestibulum sit amet urna eget nunc euismoque nulla augue, gravida vel aliquam quis, eleifend sed justo. Nam tristique enim et tortor hendrerit, id varius nunc molestie. Phasellus nisl felis, sagittis eget iaculis a, imperdiet vitae ipsum.
`
