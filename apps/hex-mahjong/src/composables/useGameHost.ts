import { onMounted, ref } from "vue";
import {
  advancePrep,
  chooseSecretCard,
  clearStoredMatch,
  confirmSecretChoice,
  createMatch,
  drawManualCard,
  loadMatch,
  saveMatch,
  setCardStatus,
  setContractAbandonWindow,
  setContractStatus,
  settleRound,
  startRound,
  toggleAugmentUse,
  undoMatch,
} from "../domain";
import type {
  AugmentTier,
  CardStatus,
  ContractStatus,
  GameMode,
  ManualDrawCategory,
  MatchState,
  RoundScores,
} from "../domain";

type SaveState = "saved" | "saving" | "error";

export function useGameHost() {
  const match = ref<MatchState | null>(null);
  const loading = ref(true);
  const saveState = ref<SaveState>("saved");
  const storageWarning = ref<string | null>(null);
  const actionError = ref<string | null>(null);
  let saveQueue: Promise<void> = Promise.resolve();
  let errorTimer: number | undefined;

  onMounted(async () => {
    try {
      match.value = await loadMatch();
    } catch (error) {
      storageWarning.value = messageOf(error);
    } finally {
      loading.value = false;
    }
  });

  function createGame(mode: GameMode, playerNames: readonly string[]) {
    const created = createMatch({ mode, players: playerNames });
    commit(startRound(created));
  }

  function startNextRound() {
    apply((current) => startRound(current));
  }

  function chooseSecret(playerId: string, instanceId: string) {
    apply((current) => chooseSecretCard(current, playerId, instanceId));
  }

  function confirmSecret(playerId: string) {
    apply((current) => {
      let next = confirmSecretChoice(current, playerId);
      const selection = next.currentRound?.secretSelection;
      if (selection && selection.confirmedPlayerIds.length === next.players.length) {
        const groupedUndoStack = next.undoStack;
        next = advancePrep(next);
        // Confirm + reveal/advance is one visible host action. Drop the
        // engine's internal all-confirmed snapshot so one undo stays usable.
        next = { ...next, undoStack: groupedUndoStack };
      }
      return next;
    });
  }

  function drawCard(kind: ManualDrawCategory, playerId?: string) {
    apply((current) => drawManualCard(current, kind, playerId));
  }

  function updateCardStatus(instanceId: string, status: CardStatus) {
    apply((current) => setCardStatus(current, instanceId, status));
  }

  function updateContractStatus(playerId: string, status: ContractStatus) {
    apply((current) => setContractStatus(current, playerId, status));
  }

  function toggleAugment(playerId: string, tier: AugmentTier) {
    apply((current) => toggleAugmentUse(current, playerId, tier));
  }

  function resolveAbandonWindow(decisions: Readonly<Record<string, "pending" | "abandoned">>) {
    apply((current) => {
      let next = setContractAbandonWindow(current, true);
      const groupedUndoStack = next.undoStack;
      for (const [playerId, status] of Object.entries(decisions)) {
        if (status === "abandoned") next = setContractStatus(next, playerId, status);
      }
      // The four private decisions are confirmed as one checkpoint in the UI.
      return { ...next, undoStack: groupedUndoStack };
    });
  }

  function submitScores(scores: RoundScores) {
    apply((current) => settleRound(current, scores));
  }

  function confirmPendingSettlement() {
    apply((current) => {
      const draft = current.currentRound?.scoreDraft;
      if (!draft || Object.values(draft).some((score) => !Number.isInteger(score))) {
        throw new Error("本局暂存分数不完整，请返回重新结算。");
      }
      return settleRound(current, draft as RoundScores, { confirmPending: true });
    });
  }

  function undo() {
    apply((current) => undoMatch(current));
  }

  async function clearGame(): Promise<boolean> {
    try {
      await saveQueue;
      await clearStoredMatch();
      match.value = null;
      saveState.value = "saved";
      storageWarning.value = null;
      return true;
    } catch (error) {
      storageWarning.value = messageOf(error);
      saveState.value = "error";
      return false;
    }
  }

  function apply(operation: (current: MatchState) => MatchState) {
    const current = match.value;
    if (!current) return;
    try {
      const next = operation(current);
      if (next !== current) commit(next);
    } catch (error) {
      showActionError(messageOf(error));
    }
  }

  function commit(next: MatchState) {
    match.value = next;
    saveState.value = "saving";
    const snapshot = next;
    saveQueue = saveQueue
      .then(() => saveMatch(snapshot))
      .then(() => {
        if (match.value === snapshot) saveState.value = "saved";
      })
      .catch((error) => {
        storageWarning.value = messageOf(error);
        if (match.value === snapshot) saveState.value = "error";
      });
  }

  function showActionError(message: string) {
    actionError.value = message;
    if (errorTimer !== undefined) window.clearTimeout(errorTimer);
    errorTimer = window.setTimeout(() => { actionError.value = null; }, 5200);
  }

  function dismissActionError() {
    actionError.value = null;
  }

  return {
    match,
    loading,
    saveState,
    storageWarning,
    actionError,
    createGame,
    startNextRound,
    chooseSecret,
    confirmSecret,
    drawCard,
    updateCardStatus,
    updateContractStatus,
    toggleAugment,
    resolveAbandonWindow,
    submitScores,
    confirmPendingSettlement,
    undo,
    clearGame,
    dismissActionError,
  };
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : "发生未知错误，请重试。";
}
