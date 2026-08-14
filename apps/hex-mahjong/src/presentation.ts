import { getCardDefinition } from "./data";
import type { AugmentTier, CardDefinition, CardInstance, MatchState, PlayerState } from "./domain/types";
import type { CardDisplay } from "./components/CardView.vue";
import type { PendingCardDisplay } from "./components/TableScreen.vue";
import type { PlayerRailData } from "./components/PlayerRail.vue";

export const MODE_LABELS = {
  strategy: "策略模式 · 138 张",
  party: "聚会模式 · 176 张",
  full: "全模块 · 192 张",
} as const;

const SEAT_MAP = {
  bottom: "south",
  right: "east",
  top: "north",
  left: "west",
} as const;

export function cardDisplay(card: CardDefinition): CardDisplay {
  return {
    id: card.id,
    name: card.name,
    category: card.categoryName,
    text: card.text,
    timing: card.timing ?? undefined,
    duration: card.duration ?? undefined,
    frequency: card.frequency ?? undefined,
    validation: card.validation ?? undefined,
  };
}

export function instanceDisplay(instance?: CardInstance | null): CardDisplay | null {
  return instance ? cardDisplay(getCardDefinition(instance.cardId)) : null;
}

export function playerDisplay(match: MatchState, player: PlayerState): PlayerRailData {
  const roundCards = match.currentRound?.temporaryCards ?? [];
  const pendingCount = roundCards.filter((card) => card.ownerId === player.id && card.status === "pending").length;
  const contractDefinition = player.contract ? getCardDefinition(player.contract.cardId) : null;
  const tiers: AugmentTier[] = ["silver", "gold", "prismatic"];

  return {
    id: player.id,
    name: player.name,
    seat: SEAT_MAP[player.seat],
    score: player.totalScore,
    contract: contractDefinition && player.contract
      ? {
          name: contractDefinition.name,
          status: player.contract.contractStatus ?? "pending",
        }
      : null,
    augments: tiers.flatMap((tier) => {
      const augment = player.augments[tier];
      if (!augment) return [];
      const definition = getCardDefinition(augment.card.cardId);
      return [{
        tier,
        name: definition.name,
        used: augment.usedThisRound > 0,
        remaining: augment.matchLimit === null ? undefined : Math.max(0, augment.matchLimit - augment.usedThisMatch),
        automatic: augment.automatic,
      }];
    }),
    pendingCount,
  };
}

export function pendingCardDisplays(match: MatchState): PendingCardDisplay[] {
  return (match.currentRound?.temporaryCards ?? []).map((instance) => ({
    instanceId: instance.instanceId,
    card: cardDisplay(getCardDefinition(instance.cardId)),
    playerName: match.players.find((player) => player.id === instance.ownerId)?.name,
    status: instance.status,
  }));
}

export function cardByInstance(instance: CardInstance): CardDisplay {
  return cardDisplay(getCardDefinition(instance.cardId));
}
