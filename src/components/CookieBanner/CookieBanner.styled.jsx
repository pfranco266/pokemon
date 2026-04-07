import styled from 'styled-components';

// ── Banner ────────────────────────────────────────────────────────────────────

export const BannerWrapper = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10000;
    background: rgba(10, 10, 10, 0.97);
    border-top: 2px solid #ffcc00;
    padding: 1.5rem 2rem;
    box-shadow: 0 -4px 20px rgba(255, 204, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 1.25rem;
        padding: 1.25rem 1.25rem 1.5rem;
    }
`;

export const BannerLeft = styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
`;

export const BannerHeading = styled.h3`
    font-family: 'Russo One', sans-serif;
    font-size: 1rem;
    color: #ffcc00;
    margin: 0;
`;

export const BannerDescription = styled.p`
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.85rem;
    line-height: 1.5;
    margin: 0;
    max-width: 600px;
`;

export const PrivacyLink = styled.a`
    color: rgba(255, 204, 0, 0.6);
    font-size: 0.75rem;
    text-decoration: underline;
    cursor: pointer;
    margin-top: 0.15rem;
    width: fit-content;

    &:hover {
        color: #ffcc00;
    }
`;

export const BannerButtons = styled.div`
    display: flex;
    gap: 0.75rem;
    flex-shrink: 0;
    align-items: center;

    @media (max-width: 768px) {
        width: 100%;
        flex-wrap: wrap;
    }
`;

const BaseButton = styled.button`
    font-family: 'Russo One', sans-serif;
    font-size: 0.85rem;
    padding: 0.6rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
    letter-spacing: 0.04em;
    white-space: nowrap;

    &:active {
        transform: scale(0.97);
    }
`;

export const AcceptButton = styled(BaseButton)`
    background: #ffcc00;
    color: #000;
    border: none;

    &:hover {
        background: #ffe033;
        transform: scale(1.02);
    }
`;

export const RejectButton = styled(BaseButton)`
    background: transparent;
    color: #ffffff;
    border: 2px solid rgba(255, 255, 255, 0.3);

    &:hover {
        border-color: #ffffff;
    }
`;

export const CustomizeButton = styled(BaseButton)`
    background: transparent;
    color: rgba(255, 204, 0, 0.8);
    border: 2px solid rgba(255, 204, 0, 0.4);

    &:hover {
        border-color: #ffcc00;
        color: #ffcc00;
    }
`;

// ── Modal overlay ─────────────────────────────────────────────────────────────

export const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 10001;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
`;

export const ModalCard = styled.div`
    background: rgba(18, 18, 18, 0.99);
    border: 1px solid #ffcc00;
    border-radius: 12px;
    padding: 1.5rem;
    width: 100%;
    max-width: 480px;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
`;

export const ModalTitle = styled.h2`
    font-family: 'Russo One', sans-serif;
    font-size: 1.1rem;
    color: #ffcc00;
    margin: 0;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(255, 204, 0, 0.2);
`;

export const CategoryRow = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
`;

export const CategoryInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

export const CategoryName = styled.span`
    font-family: 'Russo One', sans-serif;
    font-size: 0.9rem;
    color: #ffffff;
`;

export const CategoryDesc = styled.span`
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.55);
    line-height: 1.4;
`;

// ── CSS toggle switch ─────────────────────────────────────────────────────────

export const ToggleLabel = styled.label`
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
    flex-shrink: 0;
    cursor: ${({ $locked }) => $locked ? 'not-allowed' : 'pointer'};
`;

export const ToggleInput = styled.input`
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
`;

export const ToggleSlider = styled.span`
    position: absolute;
    inset: 0;
    background: ${({ $checked, $locked }) => {
        if ($locked) return 'rgba(255,204,0,0.35)';
        return $checked ? '#ffcc00' : 'rgba(255,255,255,0.15)';
    }};
    border-radius: 24px;
    transition: background 0.2s ease;

    &::before {
        content: '';
        position: absolute;
        width: 18px;
        height: 18px;
        left: ${({ $checked, $locked }) => ($checked || $locked) ? '23px' : '3px'};
        top: 3px;
        background: ${({ $locked }) => $locked ? 'rgba(255,255,255,0.5)' : '#ffffff'};
        border-radius: 50%;
        transition: left 0.2s ease;
    }
`;

export const ModalActions = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(255, 204, 0, 0.2);
`;

export const SaveButton = styled(AcceptButton)`
    width: 100%;
    font-size: 0.9rem;
`;

export const CancelLink = styled.button`
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.45);
    font-size: 0.8rem;
    cursor: pointer;
    padding: 0;
    transition: color 0.15s;

    &:hover {
        color: rgba(255, 255, 255, 0.7);
    }
`;
