'use client';

import { useState, useCallback } from 'react';
import { FaGoogle, FaFacebook, FaGithub, FaTwitter, FaMicrosoft, FaApple } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import styles from '@/styles/auth/AuthSocialButtons.module.css';

const PROVIDER_ICONS = {
    google: FaGoogle,
    gmail: SiGmail,
    facebook: FaFacebook,
    github: FaGithub,
    twitter: FaTwitter,
    microsoft: FaMicrosoft,
    apple: FaApple,
};

const PROVIDER_COLORS = {
    google: '#DB4437',
    gmail: '#DB4437',
    facebook: '#4267B2',
    github: '#333333',
    twitter: '#1DA1F2',
    microsoft: '#00A4EF',
    apple: '#000000',
};

const PROVIDER_NAMES = {
    google: 'Google',
    gmail: 'Gmail',
    facebook: 'Facebook',
    github: 'GitHub',
    twitter: 'Twitter',
    microsoft: 'Microsoft',
    apple: 'Apple',
};

// Dummy OAuth URLs for testing
const PROVIDER_URLS = {
    google: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=dummy&redirect_uri=http://localhost:3000/auth/callback&response_type=code&scope=email%20profile',
    gmail: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=dummy&redirect_uri=http://localhost:3000/auth/callback&response_type=code&scope=email',
    facebook: 'https://www.facebook.com/v12.0/dialog/oauth?client_id=dummy&redirect_uri=http://localhost:3000/auth/callback&response_type=code&scope=email,public_profile',
    github: 'https://github.com/login/oauth/authorize?client_id=dummy&redirect_uri=http://localhost:3000/auth/callback&scope=user:email',
    twitter: 'https://twitter.com/i/oauth2/authorize?client_id=dummy&redirect_uri=http://localhost:3000/auth/callback&response_type=code&scope=tweet.read%20users.read',
    microsoft: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=dummy&redirect_uri=http://localhost:3000/auth/callback&response_type=code&scope=openid%20profile%20email',
    apple: 'https://appleid.apple.com/auth/authorize?client_id=dummy&redirect_uri=http://localhost:3000/auth/callback&response_type=code&scope=name%20email',
};

export default function AuthSocialButtons({
    providers = ['google', 'facebook', 'github'],
    onProviderClick,
    onError,
    layout = 'row', // 'row', 'column', or 'grid'
    showIcon = true,
    showLabel = true,
    showDivider = true,
    dividerText = 'Or continue with',
    buttonVariant = 'outline',  // 'outline' or 'default'
    buttonSize = 'default', // 'small', 'default'
    customLabels = {},
    customIcons = {},
    customColors = {},
    disabled = false,
    isLoading = false,
    loadingProvider = null,
    useRedirect = false, // New prop to toggle between redirect and callback
    className = '',
    ...props
}) {
    const [hoveredProvider, setHoveredProvider] = useState(null);
    const [error, setError] = useState(null);

    const handleClick = useCallback(async (provider) => {
        if (disabled || isLoading) return;

        try {
            setError(null);
            
            // If useRedirect is true, redirect to provider URL
            if (useRedirect && PROVIDER_URLS[provider]) {
                window.location.href = PROVIDER_URLS[provider];
                return;
            }
            
            // Otherwise use callback
            if (onProviderClick) {
                await onProviderClick(provider);
            }
        } catch (err) {
            setError(err.message || `Error with ${provider} authentication`);
            if (onError) {
                onError(provider, err);
            }
            console.error(`Error with ${provider} authentication:`, err);
        }
    }, [disabled, isLoading, onProviderClick, onError, useRedirect]);

    const getButtonClasses = (provider) => {
        const classes = [styles.socialButton];

        if (layout === 'column') {
            classes.push(styles.columnButton);
        } else if (layout === 'grid') {
            classes.push(styles.gridButton);
        }

        if (hoveredProvider === provider && !disabled && !isLoading) {
            classes.push(styles.hovered);
        }

        if (isLoading && loadingProvider === provider) {
            classes.push(styles.loading);
        }

        return classes.join(' ');
    };

    const getIconColor = (provider) => {
        if (buttonVariant === 'default') {
            return '#ffffff';
        }
        return customColors[provider] || PROVIDER_COLORS[provider] || 'currentColor';
    };

    const renderIcon = (provider) => {
        if (!showIcon) return null;

        const IconComponent = customIcons[provider] || PROVIDER_ICONS[provider];

        if (!IconComponent) return null;

        return (
            <IconComponent
                className={styles.buttonIcon}
                style={{ color: getIconColor(provider) }}
                aria-hidden="true"
            />
        );
    };

    const renderLabel = (provider) => {
        if (!showLabel) return null;

        return (
            <span className={styles.buttonLabel}>
                {customLabels[provider] || `${PROVIDER_NAMES[provider] || provider}`}
            </span>
        );
    };

    const renderLoadingSpinner = () => (
        <div className={styles.spinner} role="status" aria-label="Loading">
            <div className={styles.spinnerCircle}></div>
        </div>
    );

    if (providers.length === 0) return null;

    return (
        <div className={`${styles.socialContainer} ${className}`} {...props}>
            {/* Divider */}
            {showDivider && (
                <div className={styles.dividerWrapper}>
                    <Separator className={styles.dividerLine} />
                    <span className={styles.dividerText}>{dividerText}</span>
                    <Separator className={styles.dividerLine} />
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className={styles.errorMessage} role="alert">
                    {error}
                </div>
            )}

            {/* Buttons Container */}
            <div className={`${styles.buttonsContainer} ${styles[`layout${layout}`]}`}>
                {providers.map((provider) => (
                    <Button
                        key={provider}
                        type="button"
                        variant={buttonVariant}
                        size={buttonSize}
                        className={getButtonClasses(provider)}
                        onClick={() => handleClick(provider)}
                        onMouseEnter={() => setHoveredProvider(provider)}
                        onMouseLeave={() => setHoveredProvider(null)}
                        disabled={disabled || (isLoading && loadingProvider !== provider)}
                        aria-label={`Sign in with ${PROVIDER_NAMES[provider] || provider}`}
                        aria-busy={isLoading && loadingProvider === provider}
                    >
                        {isLoading && loadingProvider === provider ? (
                            renderLoadingSpinner()
                        ) : (
                            <>
                                {renderIcon(provider)}
                                {renderLabel(provider)}
                            </>
                        )}
                    </Button>
                ))}
            </div>

            {/* Security Note */}
            <p className={styles.securityNote}>
                We'll never post to your social media accounts without your permission.
            </p>
        </div>
    );
}