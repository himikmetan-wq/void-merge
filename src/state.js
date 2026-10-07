import { STORAGE_KEY } from './config.js';
const defaults={best:0,games:0};
export function loadSave(){try{const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return{...defaults};return{...defaults,...JSON.parse(raw)}}catch{return{...defaults}}}
export function writeSave(data){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data))}catch{}}
