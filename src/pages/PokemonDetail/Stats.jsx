import React, { useState } from "react";
import { FlexColumnContainer, TBSContainer, TBSLabel, TBSValue, TBSBarTrack, TBSBarFill, TBSTierLabel, AttackIcon, DefenseIcon, SpecialAttackIcon, SpecialDefenseIcon, HealthIcon, SpeedIcon, AccordionToggle, AccordionChevron, AccordionContent, BattleRoleContainer, StatsSideBySide, StatChartSection, StatLegendSection, StatLegendRow, StatLegendName } from "./MoreInfo.styled";
import { Title } from "../Home/Home.styled";
import colorMap from "../../utils/colorMap";

const TBS_MAX = 800;
const CAPTURE_MAX = 255;
const STAT_MAX = 255;

function getTier(tbs) {
    if (tbs <= 250) return { label: 'Approachable',      color: '#757575' };
    if (tbs <= 330) return { label: 'Beginner Friendly', color: '#78909c' };
    if (tbs <= 420) return { label: 'Moderate',          color: '#66bb6a' };
    if (tbs <= 500) return { label: 'Intermediate',      color: '#29b6f6' };
    if (tbs <= 580) return { label: 'Advanced',          color: '#ab47bc' };
    if (tbs <= 699) return { label: 'Expert',            color: '#ff7043' };
    return             { label: 'Untouchable',           color: '#ffffff' };
}

function getCaptureLabel(rate) {
    if (rate >= 200) return 'Very Easy';
    if (rate >= 150) return 'Easy';
    if (rate >= 100) return 'Moderate';
    if (rate >=  45) return 'Difficult';
    if (rate >=  10) return 'Very Difficult';
    return                  'Near Impossible';
}

// ── Radar chart ──────────────────────────────────────────────────────────────
const CX = 150, CY = 150, R = 85, LABEL_R = 112, NUM_R = 132;

const STAT_AXES = [
    { label: 'HP',             name: 'HP',              key: 'hp',             Icon: HealthIcon        },
    { label: 'Atk',            name: 'Attack',          key: 'attack',         Icon: AttackIcon        },
    { label: 'Def',            name: 'Defense',         key: 'defense',        Icon: DefenseIcon       },
    { label: 'Sp.Atk',         name: 'Special Attack',  key: 'specialAttack',  Icon: SpecialAttackIcon },
    { label: 'Sp.Def',         name: 'Special Defense', key: 'specialDefense', Icon: SpecialDefenseIcon},
    { label: 'Spd',            name: 'Speed',           key: 'speed',          Icon: SpeedIcon         },
];

function radarPoint(i, ratio, n, cx, cy, r) {
    const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
    return {
        x: cx + ratio * r * Math.cos(angle),
        y: cy + ratio * r * Math.sin(angle),
    };
}

function RadarChart({ stats, color }) {
    const n = STAT_AXES.length;
    const values = STAT_AXES.map(a => stats[a.key]);

    const dataPoints = values.map((v, i) => radarPoint(i, Math.pow(v / STAT_MAX, 0.6), n, CX, CY, R));
    const polygonStr = dataPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

    const gridLevels = [0.25, 0.5, 0.75, 1.0];

    // Icons at LABEL_R, numbers at NUM_R (further out — always away from the chart)
    const iconPositions = STAT_AXES.map((a, i) => {
        const p = radarPoint(i, 1, n, CX, CY, LABEL_R);
        return { xPct: (p.x / 300) * 100, yPct: (p.y / 300) * 100, Icon: a.Icon };
    });

    const numberPositions = STAT_AXES.map((a, i) => {
        const p = radarPoint(i, 1, n, CX, CY, NUM_R);
        return { xPct: (p.x / 300) * 100, yPct: (p.y / 300) * 100, value: stats[a.key] };
    });

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px', aspectRatio: '1 / 1' }}>
            <svg viewBox="0 0 300 300" style={{ width: '100%', height: '100%' }}>
                {/* Background */}
                <rect x="0" y="0" width="300" height="300" fill="black" rx="10" />

                {/* Grid rings */}
                {gridLevels.map((ratio, gi) => {
                    const pts = STAT_AXES.map((_, i) => {
                        const p = radarPoint(i, ratio, n, CX, CY, R);
                        return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
                    }).join(' ');
                    return (
                        <polygon
                            key={gi}
                            points={pts}
                            fill="none"
                            stroke="rgba(255,255,255,0.4)"
                            strokeWidth="1"
                            strokeDasharray={ratio < 1 ? '3,3' : '0'}
                        />
                    );
                })}

                {/* Axis lines */}
                {STAT_AXES.map((_, i) => {
                    const end = radarPoint(i, 1, n, CX, CY, R);
                    return (
                        <line
                            key={i}
                            x1={CX} y1={CY}
                            x2={end.x.toFixed(1)} y2={end.y.toFixed(1)}
                            stroke="rgba(255,255,255,0.8)"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Data polygon */}
                <polygon
                    points={polygonStr}
                    fill="rgba(255,255,255,0.35)"
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
            </svg>

            {/* Stat icons at axis tips */}
            {iconPositions.map(({ xPct, yPct, Icon }, i) => (
                <Icon
                    key={i}
                    style={{
                        position: 'absolute',
                        left: `${xPct.toFixed(2)}%`,
                        top: `${yPct.toFixed(2)}%`,
                        transform: 'translate(-50%, -50%)',
                        height: '22px',
                        width: '22px',
                        pointerEvents: 'none',
                    }}
                />
            ))}

            {/* Stat values at NUM_R — outward beyond icons, never over chart */}
            {numberPositions.map(({ xPct, yPct, value }, i) => (
                <span
                    key={i}
                    style={{
                        position: 'absolute',
                        left: `${xPct.toFixed(2)}%`,
                        top: `${yPct.toFixed(2)}%`,
                        transform: 'translate(-50%, -50%)',
                        fontSize: '0.95rem',
                        fontWeight: '700',
                        color: '#ffffff',
                        lineHeight: 1,
                        pointerEvents: 'none',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {value}
                </span>
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────

function Stats({ memoPokemon }) {
    const [expanded, setExpanded] = useState(false);

    const { hp, attack, defense, specialAttack, specialDefense, speed } = memoPokemon.stats;
    const tbs = hp + attack + defense + specialAttack + specialDefense + speed;
    const tier = getTier(tbs);
    const pct = Math.min(Math.round((tbs / TBS_MAX) * 100), 100);
    const primaryType = memoPokemon.types?.[0]?.type?.name;
    const barColor = colorMap[primaryType]?.color ?? tier.color;
    const exceptional = tier.label === 'Untouchable';
    const glowColor = exceptional ? 'rgba(255,255,255,0.6)' : barColor;

    const captureRate = memoPokemon.capture_rate;
    const capturePct = captureRate != null ? Math.round((captureRate / CAPTURE_MAX) * 100) : 0;
    const captureLabel = captureRate != null ? getCaptureLabel(captureRate) : '';

    return (
        <FlexColumnContainer>
            <Title>{memoPokemon.name} Stats</Title>

            <TBSContainer>
                <TBSLabel>Base Stat Total</TBSLabel>
                <TBSValue tiercolor={barColor} exceptional={exceptional} glowcolor={glowColor}>{tbs}</TBSValue>
                <TBSTierLabel tiercolor={tier.color} exceptional={exceptional}>{tier.label}</TBSTierLabel>
                <TBSBarTrack>
                    <TBSBarFill pct={pct} tiercolor={barColor} />
                </TBSBarTrack>
                <AccordionToggle
                    onClick={() => setExpanded(e => !e)}
                    aria-label={expanded ? 'Collapse stats' : 'Expand stats'}
                >
                    <AccordionChevron isopen={expanded} />
                </AccordionToggle>
            </TBSContainer>

            <AccordionContent isopen={expanded}>
                {captureRate != null && (
                    <TBSContainer>
                        <TBSLabel>Capture Rate</TBSLabel>
                        <TBSValue tiercolor={barColor} exceptional={false} glowcolor={barColor}>{captureRate}</TBSValue>
                        <TBSTierLabel tiercolor="rgba(255,255,255,0.87)" exceptional={false}>{captureLabel}</TBSTierLabel>
                        <TBSBarTrack>
                            <TBSBarFill pct={capturePct} tiercolor={barColor} />
                        </TBSBarTrack>
                    </TBSContainer>
                )}
            </AccordionContent>

            <BattleRoleContainer>
                <StatsSideBySide>
                    <StatChartSection>
                        <RadarChart stats={memoPokemon.stats} color={barColor} />
                    </StatChartSection>
                    <StatLegendSection>
                        {STAT_AXES.map(({ name, key, Icon }) => (
                            <StatLegendRow key={key}>
                                <Icon style={{ height: '24px', width: '24px' }} />
                                <StatLegendName>{name}</StatLegendName>
                            </StatLegendRow>
                        ))}
                    </StatLegendSection>
                </StatsSideBySide>
            </BattleRoleContainer>
        </FlexColumnContainer>
    );
}

export default Stats;
