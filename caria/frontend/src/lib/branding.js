/**
 * branding.js
 * Standardized logo resolver for CONNECT OS
 */

export const getBranding = (clientConfig, theme = 'dark') => {
    const clientKey = clientConfig?.clientKey || 'caria';
    const brandName = clientConfig?.brandName || 'CONNECT ADMIN';

    // Check for explicit branding config
    if (clientConfig?.branding) {
        return {
            logoDark: clientConfig.branding.logoDark,
            logoLight: clientConfig.branding.logoLight,
            logoMark: clientConfig.branding.logoMark || clientConfig.branding.mark,
            brandName
        };
    }

    // Default convention fallback
    return {
        logoDark: `/clients/${clientKey}/brand/logo-dark.png`,
        logoLight: `/clients/${clientKey}/brand/logo-light.png`,
        logoMark: `/clients/${clientKey}/brand/mark.png`,
        brandName
    };
};

export const getLogoForTheme = (clientConfig, theme) => {
    const clientKey = clientConfig?.clientKey || 'caria';
    const brand = getBranding(clientConfig);

    // Caria specific override as requested (v4)
    if (clientKey === 'caria') {
        const file = theme === 'dark' ? 'caria-logo-light.png' : 'caria-logo-dark.png';
        return `/clients/caria/brand/${file}?v=4`;
    }

    // Default 'dark' theme uses LIGHT logo, 'light' theme uses DARK logo
    const logoBase = theme === 'dark' ? brand.logoLight : brand.logoDark;
    return `${logoBase}?v=4`;
};

/**
 * Aliases for specific projects/backwards compatibility
 */
export const getCariaLogoSrc = (theme) => getLogoForTheme({ clientKey: 'caria' }, theme);
export const shouldUseBackplate = (theme) => false;
