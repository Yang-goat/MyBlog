import { nextTick, ref } from 'vue';
import type { FactionId } from '../content/factions';
import { modal } from './store';
export const selectedFaction=ref<FactionId>('neighborhood');
export async function showFaction(id:FactionId){selectedFaction.value=id;modal.value='journal';await nextTick();document.querySelector('#faction-ledger')?.scrollIntoView({block:'start'});}
