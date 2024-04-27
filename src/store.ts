import { writable, type Writable } from 'svelte/store';
import type { CreneauDto } from './types';

// Create a writable store to hold the fetched data
export const asyncData:Writable<CreneauDto[]> = writable([]); // Initialize with null or any initial value
