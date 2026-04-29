const CAMPAIGN_START = new Date('2026-06-01T00:00:00Z');
const CAMPAIGN_END = new Date('2026-06-26T00:00:00Z');

export function isCampaignLive(): boolean {
  const now = new Date();
  return now >= CAMPAIGN_START && now < CAMPAIGN_END;
}
