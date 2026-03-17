import colorMap from './colorMap';

// ── Type effectiveness ──────────────────────────────────────────────────────
// colorMap[defType].typeChart[atkType] = damage multiplier when atkType hits defType
function getTypeMultiplier(atkType, defTypes) {
    return defTypes.reduce((multi, defType) => {
        const chart = colorMap[defType]?.typeChart;
        if (!chart) return multi;
        return multi * (chart[atkType] ?? 1);
    }, 1);
}

// ── Individual weighted stat score ──────────────────────────────────────────
// Each stat normalized to 0-100, then weighted; total normalized to 0-100.
// Max raw weighted sum = (100*0.04 + 100*0.05 + 100*0.04 + 100*0.05 + 100*0.04 + 100*0.03) = 25
// Multiply by 100/25 to normalize to 0-100 range.
function calcStatsScore(stats) {
    const { hp, attack, defense, specialAttack, specialDefense, speed } = stats;
    const hpScore    = (hp             / 255) * 100;
    const atkScore   = (attack         / 255) * 100;
    const defScore   = (defense        / 255) * 100;
    const spAtkScore = (specialAttack  / 255) * 100;
    const spDefScore = (specialDefense / 255) * 100;
    const spdScore   = (speed          / 255) * 100;

    const contributions = {
        hp:             hpScore    * 0.04 * 100 / 25,
        attack:         atkScore   * 0.05 * 100 / 25,
        defense:        defScore   * 0.04 * 100 / 25,
        specialAttack:  spAtkScore * 0.05 * 100 / 25,
        specialDefense: spDefScore * 0.04 * 100 / 25,
        speed:          spdScore   * 0.03 * 100 / 25,
    };

    const total = Object.values(contributions).reduce((s, v) => s + v, 0);
    return { total, contributions };
}

// ── Battle Power Score ──────────────────────────────────────────────────────
// BPS = offensive damage power + durability + individual weighted stats
export function calculateBPS(pokemonA, pokemonB) {
    const aTypes = pokemonA.types.map(t => t.type.name);
    const bTypes = pokemonB.types.map(t => t.type.name);

    // A's best type advantage vs B's types
    const aMulties = aTypes.map(t => getTypeMultiplier(t, bTypes));
    const aBestMulti = aMulties.length > 0 ? Math.max(...aMulties) : 1;
    // B's best type advantage vs A's types
    const bMulties = bTypes.map(t => getTypeMultiplier(t, aTypes));
    const bBestMulti = bMulties.length > 0 ? Math.max(...bMulties) : 1;

    const { attack: aAtk, specialAttack: aSpAtk, defense: aDef, specialDefense: aSpDef, hp: aHp, speed: aSpd } = pokemonA.stats;
    const { attack: bAtk, specialAttack: bSpAtk, defense: bDef, specialDefense: bSpDef, hp: bHp, speed: bSpd } = pokemonB.stats;

    const aOffense = Math.max(aAtk, aSpAtk);
    const bOffense = Math.max(bAtk, bSpAtk);

    // Base damage A deals to B
    const aDamage = (aOffense / Math.max(Math.max(bDef, bSpDef), 1)) * aBestMulti;
    // Base damage B deals to A
    const bDamage = (bOffense / Math.max(Math.max(aDef, aSpDef), 1)) * bBestMulti;

    // Estimated turns to KO (durability component)
    const turnsToKOa = bDamage > 0 ? aHp / (bDamage * 50) : Infinity;
    const turnsToKOb = aDamage > 0 ? bHp / (aDamage * 50) : Infinity;

    // Speed bonus
    const aSpeedBonus = aSpd > bSpd ? 1.1 : aSpd === bSpd ? 1.0 : 0.95;
    const bSpeedBonus = bSpd > aSpd ? 1.1 : aSpd === bSpd ? 1.0 : 0.95;

    // Individual weighted stat scores (0-100), scaled to ~0-3 to match other components
    const aStatsData = calcStatsScore(pokemonA.stats);
    const bStatsData = calcStatsScore(pokemonB.stats);

    const aBPS = (aDamage * aSpeedBonus) + (turnsToKOa * 2) + (aStatsData.total * 0.03);
    const bBPS = (bDamage * bSpeedBonus) + (turnsToKOb * 2) + (bStatsData.total * 0.03);

    return {
        aBPS,
        bBPS,
        aBestMulti,
        bBestMulti,
        aDamage,
        bDamage,
        aStatBreakdown: aStatsData,
        bStatBreakdown: bStatsData,
    };
}

export function determineWinner(aBPS, bBPS) {
    if (aBPS > bBPS) return 'A';
    if (bBPS > aBPS) return 'B';
    return 'tie';
}

// ── Lore tier label ─────────────────────────────────────────────────────────
export function getLoreTierInfo(pokemon) {
    if (pokemon.mythical)  return { label: 'Mythical',        color: '#ff6ec7' };
    if (pokemon.legendary) return { label: 'Legendary',       color: '#ffcc00' };
    const tbs = Object.values(pokemon.stats).reduce((s, v) => s + v, 0);
    if (tbs >= 600) return { label: 'Pseudo-Legendary', color: '#ab47bc' };
    if (tbs >= 500) return { label: 'Elite',             color: '#ff7043' };
    if (tbs >= 400) return { label: 'Strong',            color: '#29b6f6' };
    return               { label: 'Standard',            color: '#66bb6a' };
}

// ── Starter / notable final evolution set (used for lore flavor) ────────────
export const STARTER_FINAL_IDS = new Set([
    3,6,9,154,157,160,253,256,259,389,392,395,460,497,500,503,
    530,553,571,589,598,637,612,635,609,645,652,655,658,670,673,
    724,727,730,735,738,741,745,748,752,758,760,763,768,771,775,
    778,784,786,788,791,792,795,800,812,815,818,823,826,830,834,
    839,842,845,848,851,855,858,861,864,867,869,871,874,877,879,
    882,884,887,889,890,892,893,894,895,896,897,898,
]);
