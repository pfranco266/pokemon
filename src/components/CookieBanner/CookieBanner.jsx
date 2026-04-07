import React, { useState } from 'react';
import { initGA } from '../../utils/analytics';
import {
    BannerWrapper,
    BannerLeft,
    BannerHeading,
    BannerDescription,
    PrivacyLink,
    BannerButtons,
    AcceptButton,
    RejectButton,
    CustomizeButton,
    ModalOverlay,
    ModalCard,
    ModalTitle,
    CategoryRow,
    CategoryInfo,
    CategoryName,
    CategoryDesc,
    ToggleLabel,
    ToggleInput,
    ToggleSlider,
    ModalActions,
    SaveButton,
    CancelLink,
} from './CookieBanner.styled';

function CookieBanner({ onHide }) {
    const [showModal, setShowModal] = useState(false);
    const [analyticsEnabled, setAnalyticsEnabled] = useState(
        () => localStorage.getItem('analytics-consent') === 'true'
    );

    function handleAcceptAll() {
        localStorage.setItem('analytics-consent', 'true');
        localStorage.setItem('essential-consent', 'true');
        initGA();
        onHide();
    }

    function handleRejectAll() {
        localStorage.setItem('analytics-consent', 'false');
        localStorage.setItem('essential-consent', 'true');
        onHide();
    }

    function handleSavePreferences() {
        localStorage.setItem('analytics-consent', analyticsEnabled ? 'true' : 'false');
        localStorage.setItem('essential-consent', 'true');
        if (analyticsEnabled) initGA();
        setShowModal(false);
        onHide();
    }

    return (
        <>
            {showModal && (
                <ModalOverlay onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
                    <ModalCard>
                        <ModalTitle>Cookie Preferences</ModalTitle>

                        <CategoryRow>
                            <CategoryInfo>
                                <CategoryName>Essential Cookies</CategoryName>
                                <CategoryDesc>
                                    Required for the site to function. Includes visit tracking for trending Pokémon.
                                </CategoryDesc>
                            </CategoryInfo>
                            <ToggleLabel $locked>
                                <ToggleInput type="checkbox" checked disabled />
                                <ToggleSlider $checked $locked />
                            </ToggleLabel>
                        </CategoryRow>

                        <CategoryRow>
                            <CategoryInfo>
                                <CategoryName>Analytics Cookies</CategoryName>
                                <CategoryDesc>
                                    Google Analytics — helps us understand which Pokémon and features are most popular.
                                </CategoryDesc>
                            </CategoryInfo>
                            <ToggleLabel>
                                <ToggleInput
                                    type="checkbox"
                                    checked={analyticsEnabled}
                                    onChange={e => setAnalyticsEnabled(e.target.checked)}
                                />
                                <ToggleSlider $checked={analyticsEnabled} />
                            </ToggleLabel>
                        </CategoryRow>

                        <ModalActions>
                            <SaveButton onClick={handleSavePreferences}>Save Preferences</SaveButton>
                            <CancelLink onClick={() => setShowModal(false)}>Cancel</CancelLink>
                        </ModalActions>
                    </ModalCard>
                </ModalOverlay>
            )}

            <BannerWrapper>
                <BannerLeft>
                    <BannerHeading>🍪 Cookie Preferences</BannerHeading>
                    <BannerDescription>
                        We use cookies to analyze site traffic and improve your experience. Analytics cookies help
                        us understand how visitors interact with Phillymon. You can choose which cookies to accept below.
                    </BannerDescription>
                    <PrivacyLink href="#">Privacy Policy</PrivacyLink>
                </BannerLeft>

                <BannerButtons>
                    <AcceptButton onClick={handleAcceptAll}>Accept All</AcceptButton>
                    <RejectButton onClick={handleRejectAll}>Reject All</RejectButton>
                    <CustomizeButton onClick={() => setShowModal(true)}>Customize</CustomizeButton>
                </BannerButtons>
            </BannerWrapper>
        </>
    );
}

export default CookieBanner;
